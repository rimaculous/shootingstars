// 1. UTILISATION DES LIENS COMPLETS (CDN) - OBLIGATOIRE POUR TON SITE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Tes clés (Vérifiées : elles sont correctes !)
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

// --- LOGIQUE DU DESSIN ---
const canvas = document.getElementById("drawCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
let drawing = false;

if (canvas && ctx) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left,
            y: (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top
        };
    };

    const start = (e) => { drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
    const move = (e) => { if(!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
    const stop = () => { drawing = false; };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
    canvas.addEventListener("touchstart", (e) => { e.preventDefault(); start(e); });
    canvas.addEventListener("touchmove", (e) => { e.preventDefault(); move(e); });
}

// --- ENVOYER LE VŒU ET LE DESSIN ---
window.lancerVoeu = async function(nom, message) {
    if (!nom || !message) {
        alert("Remplis ton nom et ton vœu !");
        return;
    }

    const imageDessin = canvas ? canvas.toDataURL() : "";

    try {
        await addDoc(wishesRef, {
            auteur: nom,
            texte: message,
            etoile: imageDessin,
            date: Date.now()
        });
        
        // Reset
        document.getElementById('star-name').value = "";
        document.getElementById('star-wish').value = "";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        alert("Vœu envoyé ! ✨");
    } catch (e) {
        console.error("Erreur Firebase : ", e);
        alert("Erreur d'envoi. Vérifie tes 'Rules' sur Firebase !");
    }
};

// --- AFFICHER LES VŒUX DES AUTRES ---
const display = document.getElementById("wishes-display");
onSnapshot(query(wishesRef, orderBy("date", "desc")), (snapshot) => {
    if (display) {
        display.innerHTML = "";
        snapshot.forEach((doc) => {
            const v = doc.data();
            display.innerHTML += `
                <div style="margin: 15px; padding: 10px; border: 1px solid rgba(255,255,255,0.2); border-radius: 15px; text-align: center;">
                    <img src="${v.etoile}" style="width: 80px; filter: drop-shadow(0 0 5px white);">
                    <p><b>${v.auteur}</b> : ${v.texte}</p>
                </div>
            `;
        });
    }
});
