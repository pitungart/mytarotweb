let firebaseConfig = {};

async function loadFirebaseConfig() {
    try {
        const response = await fetch('/api/firebase-config');
        firebaseConfig = await response.json();
        initializeApp();
    } catch (error) {
        console.error('Config Error:', error);
    }
}

function initializeApp() {
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Elements
    // Elements
    const loginBtn = document.getElementById('login-btn');
    const authContainer = document.getElementById('auth-container');
    const userProfile = document.getElementById('user-profile');
    const userNameDisplay = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');

    // Core Elements
    const questionInput = document.getElementById('question-input');
    const drawBtn = document.getElementById('draw-btn');
    const inquirySection = document.getElementById('inquiry-section');
    const ritualContainer = document.getElementById('ritual-container');
    const cardsContainer = document.getElementById('cards-container');
    const alertContainer = document.getElementById('alert-container');

    let currentUser = null;

    // --- Minimalist Silver Alert ---
    function showAlert(message, type = 'error') {
        const alertBox = document.createElement('div');
        const borderColor = type === 'error' ? 'border-red-900/50' : 'border-purple-500/50';

        alertBox.className = `bg-obsidian/90 backdrop-blur-md border ${borderColor} px-6 py-3 shadow-2xl animate-fade-in-up rounded-full flex items-center gap-3`;
        alertBox.innerHTML = `
            <div class="w-1.5 h-1.5 rounded-full ${type === 'error' ? 'bg-red-500' : 'bg-purple-400'}"></div>
            <span class="font-sans text-[10px] uppercase tracking-widest text-silver-dim">${message}</span>
        `;
        alertContainer.appendChild(alertBox);
        setTimeout(() => {
            alertBox.style.opacity = '0';
            setTimeout(() => alertBox.remove(), 500);
        }, 3000);
    }

    // --- Auth Logic ---
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            if (authContainer) authContainer.classList.add('hidden');
            userProfile.classList.remove('hidden');
            userProfile.classList.add('flex');
            userNameDisplay.textContent = user.displayName ? user.displayName.split(' ')[0] : 'Jiwa';
        } else {
            currentUser = null;
            if (authContainer) authContainer.classList.remove('hidden');
            userProfile.classList.add('hidden');
            userProfile.classList.remove('flex');
        }
    });

    const triggerLogin = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(e => showAlert(e.message));
    };

    if (loginBtn) loginBtn.addEventListener('click', triggerLogin);
    logoutBtn.addEventListener('click', () => { auth.signOut(); location.reload(); });

    // --- Ritual Flow ---
    drawBtn.addEventListener('click', async () => {
        const question = questionInput.value.trim();
        if (!question) {
            showAlert('Semesta membutuhkan pertanyaanmu.', 'error');
            questionInput.focus();
            return;
        }

        // 1. Transition to Ritual
        // Fade out inquiry slightly
        inquirySection.classList.add('opacity-0', '-translate-y-10');
        setTimeout(() => inquirySection.classList.add('hidden'), 800);

        // Show Overlay
        ritualContainer.classList.remove('hidden');
        cardsContainer.innerHTML = '';

        // Remove old AI boxes
        document.getElementById('ai-response-box')?.remove();
        document.getElementById('unlock-ai-box')?.remove();

        // 2. Data Fetch (Simulate Ritual Time)
        const fetchPromise = shuffleAndDraw();
        const minTimePromise = new Promise(r => setTimeout(r, 3500)); // 3.5s ritual

        let cards = [];
        try {
            [cards] = await Promise.all([fetchPromise, minTimePromise]);
        } catch (e) {
            showAlert("Ritual terputus.", 'error');
            ritualContainer.classList.add('hidden');
            inquirySection.classList.remove('hidden', 'opacity-0', '-translate-y-10');
            return;
        }

        // 3. Reveal
        ritualContainer.classList.add('hidden');
        displayCards(cards);

        if (currentUser) {
            triggerAI(question, cards);
        } else {
            showUnlock(question, cards);
        }
    });

    async function shuffleAndDraw() {
        // Mock ID gen
        const totalCards = 78;
        const selectedIds = new Set();
        while (selectedIds.size < 3) selectedIds.add(Math.floor(Math.random() * totalCards) + 1);

        const promises = Array.from(selectedIds).map(id =>
            db.collection('cards').doc(String(id)).get()
        );
        const snapshots = await Promise.all(promises);
        return snapshots.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: data.id || doc.id,
                isReversed: Math.random() < 0.3 // 30% chance of being reversed
            };
        });
    }

    function displayCards(cards) {
        cardsContainer.innerHTML = '';

        cards.forEach((card, index) => {
            const el = document.createElement('div');
            el.className = "card-stack-enter w-full max-w-sm mx-auto h-full";
            el.style.animationDelay = `${index * 200}ms`;

            const meaning = card.isReversed ? card.meaning_down : card.meaning_up;
            const displayName = card.isReversed ? `${card.name} (Terbalik)` : card.name;

            el.innerHTML = `
                <div class="flex flex-col h-full relative group aura-glow rounded-2xl overflow-hidden bg-obsidian/80 backdrop-blur-xl border border-white/10 hover:border-gold/30 transition-all duration-700 shadow-2xl">
                    <!-- Minimal Glass Header -->
                    <div class=" flex justify-center p-3 border-b border-white/5 bg-gradient-to-b from-black/60 to-transparent">
                        <span class="font-sans text-[9px] uppercase tracking-[0.2em] text-gold/40 ring-1 ring-gold/10 px-2 py-0.5 rounded-md">${['Masa Lalu', 'Kini', 'Masa Depan'][index]}</span>
                    </div>

                    <!-- SVG Art Container -->
                    <div class="aspect-[2/3] relative m-1 rounded-xl overflow-hidden flex items-center justify-center bg-black/40">
                         <img src="/images/card-${card.id}.svg" 
                              class="w-full h-full object-contain transition-transform duration-1000 ${card.isReversed ? 'rotate-180' : ''}" 
                              alt="${card.name}">
                         
                         <!-- Hover Bloom Effect -->
                         <div class="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
                    </div>

                    <!-- Footer Info: Name & Meaning -->
                    <div class="flex-grow p-4 border-t border-white/5 bg-gradient-to-t from-gold/5 to-transparent flex flex-col justify-center text-center">
                        <h3 class="font-serif italic text-gold text-2xl tracking-wide mb-2">${displayName}</h3>
                        <p class="font-serif text-silver text-sm leading-relaxed opacity-70 italic">
                            "${meaning}"
                        </p>
                    </div>
                </div>
            `;
            cardsContainer.appendChild(el);
        });
    }

    // --- AI Section (Bottom Flow) ---
    function showUnlock(question, cards) {
        const box = document.createElement('div');
        box.id = 'unlock-ai-box';
        box.className = "mt-16 mx-auto max-w-lg text-center animate-fade-in-up pb-20";
        box.innerHTML = `
            <div class="border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl p-8 relative overflow-hidden group">
                <!-- Shine Effect -->
                <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>
                
                <p class="font-sans text-[9px] uppercase tracking-[0.3em] text-silver-dim mb-6 border-b border-white/5 pb-4 inline-block">Sempurnakan Koneksi</p>
                <p class="font-serif italic text-2xl text-silver/60 blur-[3px] mb-8 select-none leading-relaxed px-4">
                    Penyelarasan bintang mengisyaratkan transformasi besar di jalanmu...
                </p>
                <button id="unlock-btn" class="border border-white/20 bg-black/40 px-10 py-4 rounded-xl hover:bg-white hover:text-obsidian hover:border-white transition-all duration-500 font-sans text-[10px] uppercase tracking-[0.2em] shadow-lg">
                    Buka Interpretasi
                </button>
            </div>
        `;
        cardsContainer.parentNode.appendChild(box);

        document.getElementById('unlock-btn').addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider).then(() => {
                box.remove();
                triggerAI(question, cards);
            }).catch(e => showAlert(e.message));
        });
    }

    async function triggerAI(question, cards) {
        // Loading paint
        const loader = document.createElement('div');
        loader.id = 'ai-loading';
        loader.className = "mt-12 text-center pb-20 animate-fade-in-up";
        loader.innerHTML = `<p class="font-serif italic text-silver-dim animate-pulse">Oracle sedang menulis...</p>`;
        cardsContainer.parentNode.appendChild(loader);

        // Auto scroll to bottom
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

        try {
            const res = await fetch('/api/analyze-tarot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, cards })
            });
            const data = await res.json();
            loader.remove();

            if (!res.ok) throw new Error(data.error);
            if (data.interpretation) displayAI(data.interpretation);
        } catch (e) {
            loader.remove();
            showAlert('Koneksi terputus.', 'error');
        }
    }

    function displayAI(text) {
        const box = document.createElement('div');
        box.id = 'ai-response-box';
        box.className = "mt-12 mx-auto max-w-3xl px-4 pb-32 animate-fade-in-up";

        // Parse markdown to HTML
        const htmlContent = marked.parse(text);

        box.innerHTML = `
            <div class="relative border border-white/10 bg-obsidian/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(30,11,54,0.5)]">
                <!-- Decorative Elements -->
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
                <div class="absolute top-8 right-8 w-2 h-2 rounded-full bg-gold animate-pulse"></div>
                
                <h3 class="font-serif text-3xl md:text-4xl text-gold italic mb-8 text-center drop-shadow-md">Pesan Semesta</h3>
                
                <div class="prose prose-invert prose-gold max-w-none 
                            prose-p:font-light prose-p:tracking-wide prose-p:text-silver/90 prose-p:leading-relaxed
                            prose-headings:font-serif prose-headings:italic prose-headings:text-gold
                            prose-li:text-silver/80">
                    ${htmlContent}
                </div>
                
                <div class="mt-12 flex justify-center items-center gap-4 opacity-80">
                     <span class="w-12 h-px bg-gold/20"></span>
                     <span class="font-sans text-[9px] uppercase tracking-widest text-gold/40">Oracle Digital</span>
                     <span class="w-12 h-px bg-gold/20"></span>
                </div>
            </div>
        `;
        cardsContainer.parentNode.appendChild(box);
        // Scroll to reading
        box.scrollIntoView({ behavior: 'smooth' });
    }
}

loadFirebaseConfig();