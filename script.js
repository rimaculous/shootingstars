import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_Kyp7DEOpABxH77R3sS7gcekYe21tZpQ",
  authDomain: "wishglow-6687b.firebaseapp.com",
  projectId: "wishglow-6687b",
  storageBucket: "wishglow-6687b.firebasestorage.app",
  messagingSenderId: "512146739720",
  appId: "1:512146739720:web:5712be2a00d5f5eb0977bd",
  measurementId: "G-269CSX2R65"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const wishesRef = collection(db, "wishes");

// --- NAVIGATION ---
window.ouvrirDessin = () => {
    document.getElementById('wish-modal').style.display = 'flex';
    document.getElementById('step-drawing').style.display = 'block';
    document.getElementById('step-infos').style.display = 'none';
};

window.passerAuxInfos = () => {
    document.getElementById('step-drawing').style.display = 'none';
    document.getElementById('step-infos').style.display = 'block';
};

// --- DESSIN ---
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;
ctx.strokeStyle = "white"; ctx.lineWidth = 3; ctx.lineCap = "round";

const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    return { x, y };
};

canvas.onmousedown = (e) => { drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
canvas.onmousemove = (e) => { if(!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
window.onmouseup = () => drawing = false;

// --- LANCER L'ÉTOILE (GESTURE BAS) ---
let startY = 0;
const modalContainer = document.getElementById('modal-container');

modalContainer.ontouchstart = (e) => startY = e.touches[0].clientY;
modalContainer.ontouchend = (e) => {
    let endY = e.changedTouches[0].clientY;
    if (endY > startY + 80 && document.getElementById('step-infos').style.display === 'block') {
        modalContainer.style.transform = "translateY(1000px)"; // Animation de chute
        lancerEtoile();
    }
};

async function lancerEtoile() {
    const nom = document.getElementById('star-name').value;
    const voeu = document.getElementById('star-wish').value;
    const contact = document.getElementById('user-contact').value;
    const type = document.getElementById('contact-type').value;

    if(!nom || !voeu) return alert("Remplis le nom et le vœu !");

    try {
        await addDoc(wishesRef, {
            nom: nom, voeu: voeu,
            contact: `${type}: ${contact}`, // Stocké mais non affiché dans le ciel
            dessin: canvas.toDataURL(),
            date: Date.now()
        });
        
        setTimeout(() => {
            document.getElementById('wish-modal').style.display = 'none';
            modalContainer.style.transform = "translateY(0)";
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 500);
    } catch (e) { console.error(e); }
}

// --- AFFICHAGE CIEL ---
onSnapshot(query(wishesRef, orderBy("date", "desc")), (snap) => {
    const sky = document.getElementById("sky");
    sky.innerHTML = "";
    snap.forEach((doc) => {
        const d = doc.data();
        const star = document.createElement('div');
        star.className = 'star-creee';
        star.style.left = Math.random() * 90 + "%";
        star.style.top = Math.random() * 70 + "%";
        star.innerHTML = `<img src="${d.dessin}" style="width:50px; cursor:pointer;">`;
        star.onclick = () => alert(`⭐ Étoile: ${d.nom}\n✨ Vœu: ${d.voeu}`); // Pas de contact affiché ici
        sky.appendChild(star);
    });
});
