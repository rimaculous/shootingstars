import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TES INFOS FIREBASE ICI
const firebaseConfig = {
  apiKey: "TON_API_KEY",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "ton-projet-id",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const wishesRef = collection(db, "wishes");

// 1. ENVOYER UN VŒU
const btn = document.getElementById("btnLaunch");
btn.addEventListener("click", async () => {
    const name = document.getElementById("starName").value;
    const message = document.getElementById("userWish").value;

    if(name && message) {
        await addDoc(wishesRef, {
            name: name,
            message: message,
            date: Date.now()
        });
        alert("Ton vœu a rejoint les étoiles !");
        document.getElementById("starName").value = "";
        document.getElementById("userWish").value = "";
    }
});

// 2. AFFICHER LES VŒUX EN TEMPS RÉEL
onSnapshot(query(wishesRef, orderBy("date", "desc")), (snapshot) => {
    const container = document.getElementById("wishes-container");
    container.innerHTML = ""; 
    snapshot.forEach((doc) => {
        const wish = doc.data();
        const div = document.createElement("div");
        div.className = "wish-card";
        div.innerHTML = `<b>${wish.name}</b> : ${wish.message}`;
        container.appendChild(div);
    });
});

// 3. LE MODE QUEEN SECRET
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('mode') === 'queen') {
    document.getElementById('queen-lock').style.display = 'block';
}