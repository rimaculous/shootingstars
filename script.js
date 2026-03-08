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

// --- SKY SETUP (1200 ÉTOILES) ---
const sky = document.getElementById("sky");
for (let i = 0; i < 1200; i++) {
    const s = document.createElement('div');
    s.className = 'twinkle-star';
    s.style.left = Math.random() * 3000 + "px";
    s.style.top = Math.random() * 3000 + "px";
    s.style.animationDelay = Math.random() * 5 + "s";
    sky.appendChild(s);
}
window.scrollTo(1500 - window.innerWidth/2, 1500 - window.innerHeight/2);

// --- MODALS ---
const modal = document.getElementById('wish-modal');
const viewModal = document.getElementById('view-modal');
const welcomeModal = document.getElementById('welcome-modal');
const confirmModal = document.getElementById('confirm-modal');
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
let drawing = false; let currentColor = '#ffffff';

window.ouvrirMenu = () => modal.className = 'modal-show';
window.closeModal = () => { modal.className = 'modal-hidden'; openStep(1); clearCanvas(); };
window.closeView = () => viewModal.className = 'view-modal-hidden';
window.closeWelcome = () => welcomeModal.className = 'view-modal-hidden';
window.closeConfirm = () => { confirmModal.className = 'view-modal-hidden'; location.reload(); };

window.onload = () => { setTimeout(() => { welcomeModal.className = 'view-show'; }, 600); };

window.openStep = (n) => {
    document.querySelectorAll('.step').forEach((s, i) => s.style.display = (i+1 === n) ? 'block' : 'none');
    if(n === 3) document.getElementById('star-to-launch').src = canvas.toDataURL();
};

// --- DESSIN (EFFET DOUX + ARRÊT PROPRE) ---
function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX);
    const cy = (e.touches ? e.touches[0].clientY : e.clientY);
    return { x: cx - r.left, y: cy - r.top };
}

canvas.addEventListener('mousedown', (e) => { drawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); });
canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return; e.preventDefault();
    const p = getPos(e);
    ctx.strokeStyle = currentColor; ctx.lineWidth = 3; ctx.lineCap = "round";
    ctx.shadowBlur = 3; ctx.shadowColor = currentColor;
    ctx.lineTo(p.x, p.y); ctx.stroke();
});
window.addEventListener('mouseup', () => { drawing = false; ctx.shadowBlur = 0; });

// Support Mobile
canvas.addEventListener('touchstart', (e) => { drawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); });
canvas.addEventListener('touchmove', (e) => { if(!drawing) return; e.preventDefault(); const p = getPos(e); ctx.strokeStyle = currentColor; ctx.lineWidth = 3; ctx.shadowBlur = 3; ctx.shadowColor = currentColor; ctx.lineTo(p.x, p.y); ctx.stroke(); });
canvas.addEventListener('touchend', () => { drawing = false; });

window.setColor = (c, el) => { currentColor = c; document.querySelector('.color-dot.active').classList.remove('active'); el.classList.add('active'); };
window.clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

// --- VALIDATION ÉTAPE 2 ---
window.validerEtape2 = () => {
    const n = document.getElementById('star-name');
    const v = document.getElementById('star-wish');
    const c = document.getElementById('user-contact');
    let err = false;
    [n,v,c].forEach(el => el.classList.remove('error-field'));
    if(!n.value.trim()){ n.classList.add('error-field'); err=true; }
    if(!v.value.trim()){ v.classList.add('error-field'); err=true; }
    if(!c.value.trim()){ c.classList.add('error-field'); err=true; }
    if(!err) openStep(3);
};

// --- LANCEMENT (DRAG DOWN) ---
const starImg = document.getElementById('star-to-launch');
let sY = 0; let pulling = false;
starImg.onmousedown = (e) => { sY = e.clientY; pulling = true; starImg.style.transition = "none"; };
window.onmousemove = (e) => {
    if(!pulling) return;
    const diff = e.clientY - sY;
    if(diff > 0) {
        starImg.style.transform = `translateY(${diff}px)`;
        if(diff > 120) { launchStar(); pulling = false; }
    }
};
window.onmouseup = () => { pulling = false; starImg.style.transition = "0.3s"; starImg.style.transform = "translateY(0)"; };

async function launchStar() {
    const n = document.getElementById('star-name').value.trim();
    const v = document.getElementById('star-wish').value.trim();
    const c = document.getElementById('user-contact').value.trim();
    const ct = document.getElementById('contact-type').value;
    
    try {
        await addDoc(wishesRef, { nom: n, voeu: v, contact: `${ct}: ${c}`, image: canvas.toDataURL(), date: Date.now() });
        modal.className = 'modal-hidden';
        confirmModal.className = 'view-show';
    } catch(e) { alert("Error launching star!"); }
}

// --- RECHERCHE ---
window.filtrerEtoiles = () => {
    const q = document.getElementById('search-input').value.toLowerCase();
    document.querySelectorAll('.galaxy-star').forEach(s => {
        const nom = s.getAttribute('data-nom').toLowerCase();
        const contact = s.getAttribute('data-contact').toLowerCase();
        const match = isQueen ? (nom.includes(q) || contact.includes(q)) : nom.includes(q);
        s.classList.toggle('star-hidden', !match);
    });
};

// --- SYNC FIREBASE ---
onSnapshot(query(wishesRef, orderBy("date", "desc")), (snap) => {
    document.querySelectorAll('.galaxy-star').forEach(el => el.remove());
    snap.forEach(doc => {
        const d = doc.data();
        const s = document.createElement('div');
        s.className = 'galaxy-star';
        s.setAttribute('data-nom', d.nom); s.setAttribute('data-contact', d.contact || "");
        s.style.left = Math.random() * 2800 + "px"; s.style.top = Math.random() * 2800 + "px";
        const img = document.createElement('img'); img.src = d.image;
        img.onclick = () => {
            document.getElementById('view-img').src = d.image;
            document.getElementById('view-wish').innerText = d.voeu;
            document.getElementById('view-name').innerText = isQueen ? `${d.nom} (${d.contact})` : d.nom;
            document.getElementById('view-date').innerText = new Date(d.date).toLocaleDateString();
            viewModal.className = 'view-show';
        };
        s.appendChild(img); sky.appendChild(s);
    });
});
