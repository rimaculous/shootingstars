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

// --- LOGIQUE DE DESSIN (LE PINCEAU) ---
const canvas = document.getElementById("drawCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
let drawing = false;

if (canvas && ctx) {
    // Configuration du pinceau
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    const startDrawing = (e) => { drawing = true; draw(e); };
    const stopDrawing = () => { drawing = false; ctx.beginPath(); };
    const draw = (e) => {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    // Support mobile
    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);
}

// --- FONCTION POUR ENVOYER LE VŒU + LE DESSIN ---
window.lancerVoeu = async function(nom, message) {
    if (!nom || !message) {
        alert("N'oublie pas de remplir ton nom et ton vœu !");
        return;
    }

    let imageDessin = canvas ? canvas.toDataURL() : "";

    try {
        await addDoc(wishesRef, {
            auteur: nom,
            texte: message,
            etoile: imageDessin,
            date: Date.now()
        });

        // Nettoyage
        document.getElementById('star-name').value = "";
        document.getElementById('star-wish').value = ""; // Vérifie bien l'ID ici
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        console.log("Ton étoile a rejoint la galaxie !");
    } catch (e) {
        console.error("Erreur lors de l'envoi : ", e);
    }
};

// --- AFFICHAGE EN TEMPS RÉEL ---
const display = document.getElementById("wishes-display");
onSnapshot(query(wishesRef, orderBy("date", "desc")), (snapshot) => {
    if (display) {
        display.innerHTML = "";
        snapshot.forEach((doc) => {
            const v = doc.data();
            display.innerHTML += `
                <div class="wish-card" style="margin-bottom: 20px; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
                    ${v.etoile ? `<img src="${v.etoile}" style="width:100px; height:100px; display: block; margin: 0 auto; filter: drop-shadow(0 0 5px white);">` : ''}
                    <p style="text-align: center; margin-top: 10px;">
                        <strong>${v.auteur}</strong> : ${v.texte}
                    </p>
                </div>
            `;
        });
    }
});
