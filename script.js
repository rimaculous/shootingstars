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

// --- GESTION DU DESSIN ---
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;

ctx.strokeStyle = "white";
ctx.lineWidth = 3;
ctx.lineCap = "round";

const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return { x: clientX - rect.left, y: clientY - rect.top };
};

const start = (e) => { drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
const move = (e) => { if(!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
const stop = () => { drawing = false; };

canvas.addEventListener("mousedown", start);
canvas.addEventListener("mousemove", move);
window.addEventListener("mouseup", stop);
canvas.addEventListener("touchstart", (e) => { e.preventDefault(); start(e); });
canvas.addEventListener("touchmove", (e) => { e.preventDefault(); move(e); });

// --- ENVOI DES DONNÉES ---
document.getElementById('btn-lancer').onclick = async function() {
    const nom = document.getElementById('star-name').value;
    const message = document.getElementById('star-wish').value;
    const contact = `${document.getElementById('contact-type').value}: ${document.getElementById('user-contact').value}`;

    if (!nom || !message) return alert("Remplis ton nom et ton vœu !");

    try {
        await addDoc(wishesRef, {
            auteur: nom,
            texte: message,
            contact: contact,
            etoile: canvas.toDataURL(),
            date: Date.now()
        });
        
        // Reset formulaire
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById('star-name').value = "";
        document.getElementById('star-wish').value = "";
        document.getElementById('user-contact').value = "";
        alert("Vœu envoyé dans la galaxie ! ✨");
    } catch (e) { console.error("Erreur Firebase:", e); }
};

// --- AFFICHAGE TEMPS RÉEL ---
onSnapshot(query(wishesRef, orderBy("date", "desc")), (snap) => {
    const display = document.getElementById("wishes-display");
    display.innerHTML = "";
    snap.forEach((doc) => {
        const v = doc.data();
        display.innerHTML += `
            <div style="background:rgba(255,255,255,0.05); margin:20px; padding:15px; border-radius:20px; text-align:center; border: 1px solid rgba(255,255,255,0.1);">
                <img src="${v.etoile}" style="width:100px; filter:drop-shadow(0 0 5px white);">
                <p><b>${v.auteur}</b> (${v.contact})</p>
                <p style="font-style:italic;">"${v.texte}"</p>
            </div>`;
    });
});
