let firebaseConfig = {};

// Fetch Firebase config dari server
async function loadFirebaseConfig() {
    try {
        const response = await fetch('/api/firebase-config');
        firebaseConfig = await response.json();
        initializeApp();
    } catch (error) {
        console.error('Error loading Firebase config:', error);
    }
}

function initializeApp() {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userProfile = document.getElementById('user-profile');
    const userNameDisplay = document.getElementById('user-name');
    const questionInput = document.getElementById('question-input');
    const drawBtn = document.getElementById('draw-btn');
    const cardsContainer = document.getElementById('cards-container');

    let currentUser = null;

    // Auth state observer
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            loginBtn.classList.add('hidden');
            userProfile.classList.remove('hidden');
            userProfile.classList.add('flex');
            userNameDisplay.textContent = `Halo, ${user.displayName.split(' ')[0]}`;
        } else {
            currentUser = null;
            loginBtn.classList.remove('hidden');
            userProfile.classList.add('hidden');
            userProfile.classList.remove('flex');
        }
    });

    // Handle Login with Redirect
    loginBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithRedirect(provider);
    });

    // Handle Logout
    logoutBtn.addEventListener('click', () => {
        auth.signOut();
        location.reload();
    });

    // Draw Cards Logic
    drawBtn.addEventListener('click', async () => {
        const question = questionInput.value;
        if (!question) {
            alert('Tanyakan sesuatu pada kartu...');
            return;
        }

        // Loading State
        cardsContainer.innerHTML = `
            <div class="col-span-full text-center py-20">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                <p class="text-purple-400 animate-pulse uppercase tracking-widest">Membaca energi semesta...</p>
            </div>
        `;

        const cards = await shuffleAndDraw();
        
        setTimeout(() => {
            displayCards(cards);
            if (currentUser) {
                saveReading(question, cards);
            }
        }, 1500);
    });

    async function shuffleAndDraw() {
        const cardIds = Array.from({ length: 78 }, (_, i) => i + 1);
        const shuffled = cardIds.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    }

    function displayCards(cards) {
        if (!cardsContainer) {
            console.error("Error: Elemen 'cards-container' tidak ditemukan di HTML!");
            return;
        }
        cardsContainer.innerHTML = '';
        
        cards.forEach((id, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = "animate-fade-in";
            cardElement.style.animationDelay = `${index * 200}ms`;
            
            const isLocked = !currentUser;
            
            cardElement.innerHTML = `
                <div class="group bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-purple-500/50 transition-all duration-500 shadow-xl hover:shadow-purple-500/10">
                    <div class="relative aspect-[2/3] mb-6 overflow-hidden rounded-xl bg-slate-800">
                        <img src="https://www.sacred-texts.com/tarot/pkt/img/ar${id < 10 ? '0'+id : id}.jpg" 
                             alt="Tarot Card" 
                             class="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                    </div>
                    
                    <h3 class="text-2xl font-bold text-white mb-3">Kartu #${id}</h3>
                    
                    <div class="space-y-3">
                        <p class="text-sm font-medium text-purple-400 uppercase tracking-tighter">Makna Kartu:</p>
                        <p class="text-slate-400 leading-relaxed ${isLocked ? 'blur-md select-none' : ''}">
                            ${isLocked ? 'Isi pesan ini disembunyikan oleh takdir.' : 'Kartu ini melambangkan perubahan besar dan keberanian dalam mengambil keputusan penting.'}
                        </p>
                        
                        ${isLocked ? `
                            <div class="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-center">
                                <p class="text-xs text-purple-300 font-semibold uppercase tracking-wide">Login untuk Membuka Rahasia</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            cardsContainer.appendChild(cardElement);
        });
    }

    function saveReading(question, cards) {
        db.collection('readings').add({
            uid: currentUser.uid,
            question: question,
            cards_drawn: cards,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}

// Load config saat halaman dimuat
loadFirebaseConfig();