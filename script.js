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

// Fonction pour envoyer un vœu (connectée à ton bouton)
window.lancerVoeu = async function(nom, message) {
    if (!nom || !message) return;
    await addDoc(wishesRef, { auteur: nom, texte: message, date: Date.now() });
};

// Affichage en temps réel pour tout le monde
const display = document.getElementById("wishes-display");
onSnapshot(query(wishesRef, orderBy("date", "desc")), (snapshot) => {
    if (display) {
        display.innerHTML = "";
        snapshot.forEach((doc) => {
            const v = doc.data();
            display.innerHTML += `<div class="wish"><b>${v.auteur}</b>: ${v.texte}</div>`;
        });
    }
});
