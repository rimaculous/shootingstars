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

// --- GESTION DU MODE QUEEN ---
const urlParams = new URLSearchParams(window.location.search);
const isQueen = urlParams.get('mode') === 'queen';

// --- NAVIGATION ---
window.ouvrirMenu = () => {
    document.getElementById('wish-modal').classList.add('modal-show');
    document.getElementById('wish-modal').classList.remove('modal-hidden');
};
window.allerAuxInfos = () => {
    document.getElementById('step-draw').style.display = 'none';
    document.getElementById('step-info').style.display = 'block';
};

// --- DESSIN ---
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;
ctx.strokeStyle = "white"; ctx.lineWidth = 3; ctx.lineCap = "round";

const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return { x: clientX - rect.left, y: clientY - rect.top };
};

const startDraw = (e) => { drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
const moveDraw = (e) => { if(!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", moveDraw);
window.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("touchstart", (e) => { e.preventDefault(); startDraw(e); });
canvas.addEventListener("touchmove", (e) => { e.preventDefault(); moveDraw(e); });

// --- LANCER L'ÉTOILE (TIRER VERS LE BAS) ---
let startY = 0;
const modal = document.getElementById('wish-modal');

modal.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; }, {passive: true});
modal.addEventListener('touchend', (e) => {
    const endY = e.changedTouches[0].clientY;
    if (endY > startY + 150) { // Tirage de 150px vers le bas
        lancerEtoile();
    }
});

async function lancerEtoile() {
    const nom = document.getElementById('star-name').value;
    const voeu = document.getElementById('star-wish').value;
    const contact = `${document.getElementById('contact-type').value}: ${document.getElementById('user-contact').value}`;

    if (!nom || !voeu) return alert("Remplis au moins ton nom et ton vœu !");

    try {
        await addDoc(wishesRef, {
            nom, voeu, contact,
            image: canvas.toDataURL(),
            date: Date.now()
        });
        modal.classList.remove('modal-show');
        alert("Ton vœu s'envole vers la galaxie ! ✨");
        setTimeout(() => location.reload(), 500);
    } catch (e) { console.error(e); }
}

// --- AFFICHAGE CIEL ---
onSnapshot(query(wishesRef, orderBy("date", "desc")), (snap) => {
    const sky = document.getElementById("sky");
    snap.forEach((doc) => {
        const d = doc.data();
        const s = document.createElement('div');
        s.className = 'star-item';
        
        // Si mode Queen, on ajoute le contact à l'alerte
        const alerteTxt = isQueen 
            ? `Etoile de: ${d.nom}\\nVoêu: ${d.voeu}\\nADMIN INFO: ${d.contact}`
            : `Etoile de: ${d.nom}\\nVoêu: ${d.voeu}`;

        s.innerHTML = `<img src="${d.image}" onclick="alert('${alerteTxt}')">`;
        s.style.left = Math.random() * 90 + "%";
        s.style.top = Math.random() * 80 + "%";
        sky.appendChild(s);
    });
});
