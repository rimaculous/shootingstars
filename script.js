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

// --- 1. GESTION DES FENÊTRES (ÉTAPES) ---
window.ouvrirDessin = () => document.getElementById('wish-modal').style.display = 'flex';
window.passerAuxInfos = () => {
    document.querySelector('.drawing-area').style.display = 'none';
    document.getElementById('infos-supplementaires').style.display = 'block';
};

// --- 2. LOGIQUE DU DESSIN ---
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;
ctx.strokeStyle = "white"; 
ctx.lineWidth = 3;

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mousemove", (e) => {
    if(!drawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
});
window.addEventListener("mouseup", () => { drawing = false; ctx.beginPath(); });

// --- 3. LANCER L'ÉTOILE (TIRER VERS LE BAS) ---
let startY = 0;
const starLaunch = document.getElementById('wish-modal');

starLaunch.addEventListener('touchstart', (e) => startY = e.touches[0].clientY);
starLaunch.addEventListener('touchend', (e) => {
    let endY = e.changedTouches[0].clientY;
    if (endY > startY + 100) { // Si on tire vers le bas de plus de 100px
        lancerL_Etoile();
    }
});

async function lancerL_Etoile() {
    const nom = document.getElementById('star-name').value;
    const voeu = document.getElementById('star-wish').value;
    const contact = document.getElementById('user-contact').value;
    const type = document.getElementById('contact-type').value;

    if(!nom || !voeu) return alert("Nom et vœu obligatoires !");

    try {
        // SAUVEGARDE DANS FIREBASE
        await addDoc(wishesRef, {
            nom: nom,
            voeu: voeu,
            contact: `${type}: ${contact}`, // Enregistré mais invisible pour les autres
            dessin: canvas.toDataURL(),
            date: Date.now()
        });
        
        starLaunch.style.display = 'none';
        alert("Ton étoile s'est envolée ! ✨");
        location.reload(); // Pour rafraîchir le ciel
    } catch (e) { console.error(e); }
}

// --- 4. AFFICHAGE DANS LE CIEL (SANS LES CONTACTS) ---
onSnapshot(query(wishesRef, orderBy("date", "desc")), (snap) => {
    const sky = document.getElementById("sky");
    snap.forEach((doc) => {
        const data = doc.data();
        const star = document.createElement('div');
        star.className = 'star-creee';
        star.innerHTML = `<img src="${data.dessin}" style="width:50px; cursor:pointer;" onclick="alert('Vœu de ${data.nom}: ${data.voeu}')">`;
        star.style.left = Math.random() * 90 + "%";
        star.style.top = Math.random() * 60 + "%";
        sky.appendChild(star);
    });
});
