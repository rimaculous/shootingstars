body { margin:0; background:#000; color:white; font-family:'Courier New', monospace; overflow: auto; user-select: none; }
#sky-container { width: 3000px; height: 3000px; position: relative; }
#sky { width: 100%; height: 100%; position: absolute; background: radial-gradient(circle at center, #1b2735 0%, #000 100%); z-index: 1; pointer-events: none; }

.twinkle-star { position: absolute; width: 2px; height: 2px; background: white; border-radius: 50%; box-shadow: 0 0 5px white; animation: twinkle 4s infinite ease-in-out; z-index: 2; }
@keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.2); } }

#open-btn { position:fixed; top:20px; left:20px; width:45px; height:45px; border-radius:50%; border:1px solid white; background:rgba(0,0,0,0.5); color:white; font-size:22px; z-index:2000; cursor: pointer; }
#search-container { position: fixed; bottom: 20px; right: 20px; z-index: 2000; width: 180px; }
#search-input { width: 100%; padding: 10px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.3); background: rgba(0,0,0,0.8); color: white; font-size: 0.9rem; outline: none; }

.modal-hidden, .view-modal-hidden { display:none; }
.modal-show, .view-show { display:flex !important; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); justify-content:center; align-items:center; z-index:3000; }
.modal-content, .view-content { background:#1b2735; padding:25px; border-radius:20px; width: 80%; max-width: 320px; max-height: 85vh; text-align:center; border: 1px solid rgba(255,255,255,0.1); position:relative; backdrop-filter: blur(15px); display: flex; flex-direction: column; }

.scroll-container { overflow-y: auto; padding-right: 5px; margin-top: 10px; }
.scroll-container::-webkit-scrollbar { width: 4px; }
.scroll-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }

.close-modal, .close-view { position: absolute; top: 12px; left: 12px; background: none; border: none; color: white; font-size: 22px; cursor: pointer; z-index: 10; }

.drawing-area { background:#090a0f; border-radius:15px; margin:10px 0; height:220px; touch-action: none; border: 1px dashed rgba(255,255,255,0.2); }
.galaxy-star { position: absolute; cursor: pointer; z-index: 1000; width: 50px; height: 50px; display: flex; justify-content: center; align-items: center; transition: opacity 0.3s, transform 0.3s; }
.star-hidden { opacity: 0; pointer-events: none; transform: scale(0); }
.galaxy-star img { width: 100%; filter: drop-shadow(0 0 5px white); pointer-events: auto; }

.color-dot { width: 22px; height: 22px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: 0.2s; }
.color-dot.active { transform: scale(1.2); border-color: white; }

input, textarea, select { width: 90%; margin: 6px 0; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 8px; font-size: 0.9rem; outline: none; }
.contact-row { display: flex; gap: 5px; width: 95%; margin: 0 auto; }

button.next-btn { background: white; color: #1b2735; font-weight: bold; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer; margin-top: 10px; }
button.action-btn { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 15px; cursor: pointer; }

#launch-zone { height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: visible; }
.star-preview { width: 70px; filter: drop-shadow(0 0 10px white); cursor: grab; position: relative; z-index: 5000; touch-action: none; }

.error-field { border: 1px solid #ff4d4d !important; background: rgba(255, 77, 77, 0.1) !important; animation: shake 0.3s; }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
