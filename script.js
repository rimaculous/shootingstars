import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Tes clés Firebase récupérées sur tes photos
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

// --- 1. FONCTION POUR ENVOYER LE VŒU + LE DESSIN ---
window.lancerVoeu = async function(nom, message) {
    if (!nom || !message) {
        alert("N'oublie pas de remplir ton nom et ton vœu !");
        return;
    }

    // On récupère le canvas pour capturer ton dessin
    const canvas = document.querySelector("canvas");
    let imageDessin = "";
    
    if (canvas) {
        imageDessin = canvas.toDataURL(); // Transforme le dessin en texte (Base64)
    }

    try {
        await addDoc(wishesRef, {
            auteur: nom,
            texte: message,
            etoile: imageDessin, // On enregistre l'image du dessin
            date: Date.now()
        });

        // Nettoyage après l'envoi
        document.getElementById('star-name').value = "";
        document.getElementById('your-wish').value = "";
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        console.log("Ton étoile a rejoint la galaxie !");
    } catch (e) {
        console.error("Erreur lors de l'envoi : ", e);
    }
};

// --- 2. AFFICHAGE DES DESSINS ET VŒUX DES AUTRES (TEMPS RÉEL) ---
const display = document.getElementById("wishes-display");

onSnapshot(query(wishesRef, orderBy("date", "desc")), (snapshot) => {
    if (display) {
        display.innerHTML = ""; // On vide pour mettre à jour
        snapshot.forEach((doc) => {
            const v = doc.data();
            
            // On crée une petite carte pour chaque vœu avec son dessin
            display.innerHTML += `
                <div class="wish-card" style="margin-bottom: 20px; border: 1px solid #444; padding: 10px; border-radius: 10px;">
                    ${v.etoile ? `<img src="${v.etoile}" style="width:150px; background: black; border-radius: 50%; display: block; margin: 0 auto;">` : ''}
                    <p style="text-align: center; color: white;">
                        <strong>${v.auteur}</strong> : ${v.texte}
                    </p>
                </div>
            `;
        });
    }
});
