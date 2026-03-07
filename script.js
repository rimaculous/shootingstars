import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your Firebase Config (Correct)
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

// --- 1. THE SKY: CREATE SCINTILLATING STARS ---
const sky = document.getElementById("sky");
for (let i = 0; i < 300; i++) { // Create 300 twinkling stars
    const star = document.createElement('div');
    star.className = 'twinkle-star';
    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";
    star.style.animationDelay = Math.random() * 5 + "s";
    sky.appendChild(star);
}

// --- 2. QUEEN MODE DETECTION ---
const urlParams = new URLSearchParams(window.location.search);
const isQueen = urlParams.get('mode') === 'queen';
if (isQueen) {
    document.getElementById('admin-crown').style.display = 'block';
    console.log("Welcome, Your Majesty. Secret details unlocked.");
}

// --- 3. MODAL NAVIGATION ---
const modal = document.getElementById('wish-modal');
const steps = ['step-1', 'step-2', 'step-3'];

window.openWishStep = (stepNumber) => {
    modal.classList.add('modal-show');
    modal.classList.remove('modal-hidden');
    steps.forEach((id, index) => {
        document.getElementById(id).style.display = (index + 1 === stepNumber) ? 'block' : 'none';
    });
    if (stepNumber === 3) prepareLaunch();
};

window.closeModal = () => modal.classList.remove('modal-show');

// --- 4. DRAWING LOGIC (Photo 6) ---
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;
let currentColor = 'white';
ctx.lineWidth = 4; ctx.lineCap = "round";

window.setColor = (color, el) => {
    currentColor = color;
    document.querySelector('.color-dot.active').classList.remove('active');
    el.classList.add('active');
};
window.clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    return {x, y};
};

canvas.addEventListener("mousedown", (e) => { drawing = true; ctx.strokeStyle = currentColor; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
canvas.addEventListener("mousemove", (e) => { if(!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); });
window.addEventListener("mouseup", () => drawing = false);

// --- 5. LAUNCH LOGIC: PULL DOWN WITH MOUSE (Photo 8) ---
const dragArea = document.getElementById('step-3');
const starPreview = document.getElementById('star-to-launch');
let isDragging = false;
let dragStartY = 0;

function prepareLaunch() {
    starPreview.src = canvas.toDataURL(); // Use the drawing
}

dragArea.addEventListener('mousedown', (e) => {
    if (e.target.id === 'star-to-launch' || e.target.closest('.pull-handle')) {
        isDragging = true;
        dragStartY = e.clientY;
        starPreview.classList.add('dragging');
    }
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    let dragY = e.clientY - dragStartY;
    if (dragY > 0) { // Only pull down
        starPreview.style.transform = `translateY(${dragY}px) scale(1.1)`;
        if (dragY > 150) { // Pulled enough
            finishLaunch();
            isDragging = false;
        }
    }
});

window.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        starPreview.style.transform = 'translateY(0) scale(1)';
        starPreview.classList.remove('dragging');
    }
});

async function finishLaunch() {
    const nom = document.getElementById('star-name').value;
    const voeu = document.getElementById('star-wish').value;
    const contact = `${document.getElementById('contact-type').value}: ${document.getElementById('user-contact').value}`;

    if (!nom || !voeu) { openWishStep(2); return alert("Missing details!"); }

    try {
        await addDoc(wishesRef, {
            nom, voeu, contact,
            image: canvas.toDataURL(),
            date: Date.now()
        });
        modal.classList.remove('modal-show');
        alert("Your star is in the Galaxy! ✨");
        setTimeout(() => location.reload(), 500);
    } catch (e) { console.error(e); }
}

// --- 6. GALAXY DISPLAY (Secure) ---
onSnapshot(query(wishesRef, orderBy("date", "desc")), (snap) => {
    sky.innerHTML = ""; // Keep scintillating stars
    for (let i = 0; i < 300; i++) { /* recreate background stars */ } 
    
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
        s.style.animationDelay = Math.random() * 5 + "s";
        sky.appendChild(s);
    });
});
