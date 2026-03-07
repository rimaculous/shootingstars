import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your Firebase Config (Correct as seen in image_0.png)
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

// --- 1. THE SKY: CREATE SCINTILLATING STARS (Photo 10 correction) ---
const sky = document.getElementById("sky");
for (let i = 0; i < 300; i++) { // We create 300 background stars
    const star = document.createElement('div');
    star.className = 'twinkle-star';
    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";
    star.style.animationDelay = Math.random() * 5 + "s"; // Random sparkle timing
    sky.appendChild(star);
}

// --- 2. QUEEN MODE DETECTION (?mode=queen) ---
const urlParams = new URLSearchParams(window.location.search);
const isQueen = urlParams.get('mode') === 'queen';

if (isQueen) {
    console.log("Welcome, Your Majesty. Secret details unlocked.");
}

// --- 3. MODAL NAVIGATION (Now hidden by default, visible on '+' click) ---
const modal = document.getElementById('wish-modal');
const steps = ['step-1', 'step-2', 'step-3'];

// Open Modal from Step 1 on '+' button click (Photo 9)
window.ouvrirMenu = () => {
    modal.classList.add('modal-show');
    modal.classList.remove('modal-hidden');
    openStep(1); // Start from drawing
};

window.openStep = (stepNumber) => {
    steps.forEach((id, index) => {
        document.getElementById(id).style.display = (index + 1 === stepNumber) ? 'block' : 'none';
    });
    if (stepNumber === 3) prepareLaunch();
};

window.closeModal = () => {
    modal.classList.add('modal-hidden');
    modal.classList.remove('modal-show');
};

// --- 4. DRAWING LOGIC (Photo 7 & 6) ---
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;
ctx.strokeStyle = "white"; ctx.lineWidth = 4; ctx.lineCap = "round";

const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    return {x, y};
};

canvas.addEventListener("mousedown", (e) => { drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
canvas.addEventListener("mousemove", (e) => { if(!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); });
window.addEventListener("mouseup", () => drawing = false);

// --- 5. LAUNCH LOGIC: PULL DOWN (Photo 8) ---
const launchZone = document.getElementById('step-3');
const starPreview = document.getElementById('star-to-launch');
let startY = 0;
let isDragging = false;

function prepareLaunch() {
    starPreview.src = canvas.toDataURL(); // Display drawing on launch screen
}

// Mouse/Touch Pull Logic
const startPull = (e) => { startY = e.clientY || e.touches[0].clientY; isDragging = true; starPreview.style.transition = "none"; };
const movePull = (e) => {
    if (!isDragging) return;
    let dragY = (e.clientY || e.touches[0].clientY) - startY;
    if (dragY > 0) { // Only pull down
        starPreview.style.transform = `translateY(${dragY}px) scale(1.1)`;
        if (dragY > 150) { // Pulled down far enough (150px)
            finishLaunch();
            isDragging = false;
        }
    }
};
const endPull = () => { if (isDragging) { isDragging = false; starPreview.style.transition = "0.3s ease"; starPreview.style.transform = 'translateY(0) scale(1)'; } };

launchZone.addEventListener('mousedown', startPull);
window.addEventListener('mousemove', movePull);
window.addEventListener('mouseup', endPull);

async function finishLaunch() {
    const nom = document.getElementById('star-name').value;
    const voeu = document.getElementById('star-wish').value;
    const contact = `${document.getElementById('contact-type').value}: ${document.getElementById('user-contact').value}`;

    if (!nom || !voeu) { openStep(2); return alert("Missing details!"); }

    try {
        await addDoc(wishesRef, {
            nom, voeu, contact,
            image: canvas.toDataURL(), // Save the drawing
            date: Date.now()
        });
        closeModal();
        alert("Your star is in the Galaxy! ✨");
        setTimeout(() => location.reload(), 500); // Reload to show the new star
    } catch (e) { console.error(e); }
}

// --- 6. GALAXY DISPLAY (Photo 10 & 9) ---
onSnapshot(query(wishesRef, orderBy("date", "desc")), (snap) => {
    sky.innerHTML = ""; // Clear existing stars
    snap.forEach((doc) => {
        const d = doc.data();
        const s = document.createElement('div');
        s.className = 'galaxy-star';
        
        // Mode Queen decides what the alert shows
        const alerteTxt = isQueen 
            ? `Star: ${d.nom}\\nWish: ${d.voeu}\\nCONTACT: ${d.contact}`
            : `Star: ${d.nom}\\nWish: ${d.voeu}`;

        s.innerHTML = `<img src="${d.image}" onclick="alert('${alerteTxt}')">`;
        s.style.left = Math.random() * 90 + "%";
        s.style.top = Math.random() * 80 + "%";
         sky.appendChild(s);
    });
});
