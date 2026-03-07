import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_Kyp7DEOpABxH77R3sS7gcekYe21tZpQ",
  authDomain: "wishglow-6687b.firebaseapp.com",
  projectId: "wishglow-6687b",
  storageBucket: "wishglow-6687b.firebasestorage.app",
  messagingSenderId: "512146739720",
  appId: "1:512146739720:web:5712be2a00d5f5eb0977bd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const wishesRef = collection(db, "wishes");
const isQueen = new URLSearchParams(window.location.search).get('mode') === 'queen';

// --- 1. SKY GENERATION ---
const sky = document.getElementById("sky");
function createBg() {
    for (let i = 0; i < 180; i++) {
        const s = document.createElement('div');
        s.className = 'twinkle-star';
        s.style.left = Math.random() * 100 + "vw";
        s.style.top = Math.random() * 100 + "vh";
        s.style.animationDelay = Math.random() * 5 + "s";
        sky.appendChild(s);
    }
}
createBg();

// --- 2. MODALS & DRAWING ---
const modal = document.getElementById('wish-modal');
const viewModal = document.getElementById('view-modal');
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;
let currentColor = 'white';

window.ouvrirMenu = () => modal.className = 'modal-show';
window.closeModal = () => modal.className = 'modal-hidden';
window.closeView = () => viewModal.className = 'view-modal-hidden';

window.openStep = (n) => {
    document.querySelectorAll('.step').forEach((s, i) => s.style.display = (i+1 === n) ? 'block' : 'none');
    if(n === 3) document.getElementById('star-to-launch').src = canvas.toDataURL();
};

window.setColor = (c, el) => {
    currentColor = c;
    document.querySelector('.color-dot.active').classList.remove('active');
    el.classList.add('active');
};
window.clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

canvas.onmousedown = (e) => { drawing = true; ctx.beginPath(); ctx.strokeStyle = currentColor; ctx.lineWidth = 4; ctx.lineCap = "round"; };
canvas.onmousemove = (e) => { 
    if(!drawing) return; 
    const r = canvas.getBoundingClientRect(); 
    ctx.lineTo(e.clientX - r.left, e.clientY - r.top); 
    ctx.stroke(); 
};
window.onmouseup = () => drawing = false;

// --- 3. PULL DOWN TO LAUNCH ---
const starImg = document.getElementById('star-to-launch');
let startY = 0;
let isPulling = false;

starImg.onmousedown = (e) => { startY = e.clientY; isPulling = true; starImg.style.transition = "none"; };
window.onmousemove = (e) => {
    if(!isPulling) return;
    let diff = e.clientY - startY;
    if(diff > 0) {
        starImg.style.transform = `translateY(${diff}px)`;
        if(diff > 140) { launchStar(); isPulling = false; }
    }
};
window.onmouseup = () => { isPulling = false; starImg.style.transition = "0.3s"; starImg.style.transform = "translateY(0)"; };

async function launchStar() {
    const data = {
        nom: document.getElementById('star-name').value || "Someone",
        voeu: document.getElementById('star-wish').value,
        contact: `${document.getElementById('contact-type').value}: ${document.getElementById('user-contact').value}`,
        image: canvas.toDataURL(),
        date: Date.now()
    };
    await addDoc(wishesRef, data);
    closeModal();
    location.reload();
}

// --- 4. DISPLAY GALAXY & POPUP ---
onSnapshot(query(wishesRef, orderBy("date", "desc")), (snap) => {
    sky.innerHTML = "";
    createBg();
    snap.forEach(doc => {
        const d = doc.data();
        const s = document.createElement('div');
        s.className = 'galaxy-star';
        s.style.left = Math.random() * 90 + "vw";
        s.style.top = Math.random() * 80 + "vh";
        
        const img = document.createElement('img');
        img.src = d.image;
        img.onclick = () => {
            document.getElementById('view-img').src = d.image;
            document.getElementById('view-wish').innerText = d.voeu;
            document.getElementById('view-name').innerText = isQueen ? `${d.nom} (${d.contact})` : d.nom;
            document.getElementById('view-date').innerText = new Date(d.date).toLocaleDateString();
            viewModal.className = 'view-show';
        };
        s.appendChild(img);
        sky.appendChild(s);
    });
});
