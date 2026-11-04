document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // 1. Inisialisasi Data dari config.js
    if (typeof CONFIG !== 'undefined') {
        if (CONFIG.backgrounds && CONFIG.backgrounds.globalPattern) {
            document.body.style.backgroundImage = `url('${CONFIG.backgrounds.globalPattern}')`;
        }

        if (document.getElementById('initBride')) document.getElementById('initBride').innerText = CONFIG.couple.brideInitial || CONFIG.couple.bride.charAt(0);
        if (document.getElementById('initGroom')) document.getElementById('initGroom').innerText = CONFIG.couple.groomInitial || CONFIG.couple.groom.charAt(0);
        
        let coupleTitleEl = document.getElementById('coupleTitle');
        if (!coupleTitleEl) {
            const coverTag = document.getElementById('cover-title-tag');
            if (coverTag && coverTag.parentNode) {
                coupleTitleEl = document.createElement('h1');
                coupleTitleEl.id = 'coupleTitle';
                coupleTitleEl.className = 'font-serif text-3xl sm:text-4xl font-bold text-rose-50 leading-tight';
                coverTag.parentNode.parentNode.insertBefore(coupleTitleEl, coverTag.parentNode.nextSibling);
            }
        }

        const namaPria = CONFIG.wedding && CONFIG.wedding.pria ? CONFIG.wedding.pria.panggilan : CONFIG.couple.groom;
        const namaWanita = CONFIG.wedding && CONFIG.wedding.wanita ? CONFIG.wedding.wanita.panggilan : CONFIG.couple.bride;

        if (coupleTitleEl && CONFIG.couple) {
            coupleTitleEl.innerHTML = `
                <span class="font-script text-4xl sm:text-5xl font-normal text-rose-200 block my-1">${namaPria}</span> 
                <span class="text-amber-300 font-serif text-xl">&amp;</span> 
                <span class="font-script text-4xl sm:text-5xl font-normal text-rose-200 block my-1">${namaWanita}</span>
            `;
        }

        const heroCoupleTitleEl = document.getElementById('heroCoupleTitle');
        if (heroCoupleTitleEl && CONFIG.couple) {
            heroCoupleTitleEl.innerHTML = `
                <span class="font-script text-4xl sm:text-6xl font-normal text-rose-200 block sm:inline my-1">${namaPria}</span> 
                <span class="text-amber-300 font-serif text-xl sm:text-2xl mx-2">&amp;</span> 
                <span class="font-script text-4xl sm:text-6xl font-normal text-rose-200 block sm:inline my-1">${namaWanita}</span>
            `;
        }
        
        if (document.getElementById('weddingQuote')) document.getElementById('weddingQuote').innerText = CONFIG.event.quote;
        if (document.getElementById('eventDateText')) document.getElementById('eventDateText').innerText = CONFIG.event.dateText;
        if (document.getElementById('btnCalendar')) document.getElementById('btnCalendar').href = CONFIG.googleCalendarUrl;
        
        const audioSource = document.getElementById('audioSource');
        const bgMusic = document.getElementById('bgMusic');
        if (audioSource && bgMusic) {
            audioSource.src = CONFIG.audioUrl;
            bgMusic.load();
        }
        
        renderBankCards();
        renderProfiles();
        renderLoveStory();
        renderSchedules();
        renderGallery();
        fetchComments();
    }

    // 2. Parse Parameter Nama Tamu dari Query String (?to=NamaTamu)
    const urlParams = new URLSearchParams(window.location.search);
    const guest = urlParams.get('to');
    const guestNameEl = document.getElementById('guestName');
    if (guestNameEl) {
        if (guest) {
            guestNameEl.innerText = decodeURIComponent(guest.replace(/\+/g, ' '));
        } else {
            guestNameEl.innerText = "Tamu Undangan";
        }
    }

    // 3. Listener Tombol Buka Undangan & Inisialisasi AOS Animasi
    const openBtn = document.getElementById('btnOpen');
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            const cover = document.getElementById('sec-cover');
            const mainContent = document.getElementById('main-content');
            
            if (cover) cover.classList.add('opacity-0', 'scale-105', 'pointer-events-none');
            
            setTimeout(() => {
                if (cover) cover.style.display = 'none';
                if (mainContent) {
                    mainContent.classList.remove('hidden');
                    setTimeout(() => {
                        mainContent.classList.remove('opacity-0');
                        if (typeof AOS !== 'undefined') {
                            AOS.init({
                                duration: 800,
                                once: false,
                                mirror: true
                            });
                        }
                    }, 50);
                }
            }, 800);

            playAudio();
        });
    }

    // 4. Jalankan Timer & Event Listener Interaktif Scroll
    startCountdown();
    window.addEventListener('scroll', handleTimelineScroll);

    // 5. Setup RSVP Form Handler
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = rsvpForm.querySelector('button[type="submit"]');
            const name = document.getElementById('input-name').value;
            const status = document.getElementById('input-status').value;
            const msg = document.getElementById('input-message').value;

            if (typeof CONFIG === 'undefined' || !CONFIG.scriptUrl || CONFIG.scriptUrl.includes("PASTER_URL")) {
                showToast("URL Database Google Script belum dipasang!");
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerText = "Mengirim...";

            const payload = { name: name, status: status, message: msg };

            fetch(CONFIG.scriptUrl, {
                method: 'POST',
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(res => {
                showToast('Terima kasih! Ucapan Anda telah tersimpan.');
                document.getElementById('input-message').value = '';
                submitBtn.disabled = false;
                submitBtn.innerText = "Kirim Ucapan";
                fetchComments();
            })
            .catch(err => {
                console.error("Gagal mengirim ucapan:", err);
                showToast('Terjadi kesalahan saat menyimpan ucapan.');
                submitBtn.disabled = false;
                submitBtn.innerText = "Kirim Ucapan";
            });
        });
    }
}

/* Render Kartu Rekening Bank di Dalam Amplop Digital */
function renderBankCards() {
    const container = document.getElementById('giftCardsContainer');
    if (!container || !CONFIG.bankAccounts) return;

    container.innerHTML = `
        <div class="gift-cards-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${CONFIG.bankAccounts.map(acc => `
                <div class="gift-card">
                    <div class="bank-badge">${acc.bankName || acc.bank}</div>
                    <div class="account-number" id="${acc.id}">${acc.accountNumber || acc.number}</div>
                    <div class="account-holder">${acc.accountHolder || ('a.n. ' + acc.owner)}</div>
                    <button class="btn-copy" onclick="event.stopPropagation(); copyToClipboard('${acc.id}', '${acc.bankName || acc.bank}')">
                        <svg viewBox="0 0 24 24">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                        </svg>
                        Salin Rekening
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

/* LOGIKA KELUAR-MASUK AMPLOP DIGITAL INTERAKTIF */
function toggleEnvelope() {
    const wrapper = document.getElementById('envelopeWrapper');
    const hint = document.getElementById('envelopeHint');
    if (!wrapper) return;

    wrapper.classList.toggle('is-open');

    if (wrapper.classList.contains('is-open')) {
        if (hint) hint.innerText = "Klik amplop untuk menutup kembali";
        createSparkles();
    } else {
        if (hint) hint.innerText = "Klik amplop untuk membuka";
    }
}

/* Efek Sparkle Emas saat Amplop Dibuka */
function createSparkles() {
    const container = document.getElementById('sparklesContainer');
    if (!container) return;
    container.innerHTML = '';

    for (let i = 0; i < 12; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-particle';
        sparkle.style.left = `${Math.random() * 80 + 10}%`;
        sparkle.style.top = `${Math.random() * 50 + 20}%`;
        sparkle.style.animationDelay = `${Math.random() * 0.4}s`;
        container.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1200);
    }
}

/* Render Love Story Timeline Interaktif */
function renderLoveStory() {
    const storyContainer = document.getElementById('story-container');
    if (!storyContainer || !CONFIG.loveStory) return;
    
    const lineBg = storyContainer.querySelector('.timeline-line-bg');
    const lineProgress = storyContainer.querySelector('.timeline-line-progress');
    
    storyContainer.innerHTML = '';
    if (lineBg) storyContainer.appendChild(lineBg);
    if (lineProgress) storyContainer.appendChild(lineProgress);

    CONFIG.loveStory.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'timeline-item relative pl-6 space-y-2 group text-left';
        card.setAttribute('data-aos', 'fade-left');
        card.setAttribute('data-aos-delay', (index * 150).toString());

        card.innerHTML = `
            <div class="timeline-dot absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#14080b] border-2 border-amber-400/40 flex items-center justify-center shadow-sm transition-all duration-500">
                <div class="w-1.5 h-1.5 rounded-full bg-rose-400 opacity-40 dot-inner transition-all duration-500"></div>
            </div>
            <div class="bg-[#1f0d14] border border-amber-400/20 p-5 rounded-2xl shadow-md hover:shadow-lg transition-all space-y-2">
                <span class="px-3 py-1 bg-[#2a1219] text-amber-300 border border-amber-400/30 text-xs font-bold rounded-full shadow-sm inline-block">${item.year}</span>
                <h3 class="font-serif text-lg font-bold text-rose-50">${item.title}</h3>
                <p class="text-xs text-rose-200/80 leading-relaxed pt-1">${item.description}</p>
            </div>
        `;
        storyContainer.appendChild(card);
    });
}

/* Logika Interaktif Scroll Timeline (Garis Menyala Saat Di-scroll) */
function handleTimelineScroll() {
    const container = document.getElementById('story-container');
    const progressBar = document.getElementById('timelineProgress');
    if (!container || !progressBar) return;

    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
        const totalHeight = rect.height;
        const visibleY = windowHeight - rect.top;
        let progress = (visibleY / totalHeight) * 100;
        progress = Math.min(Math.max(progress, 0), 100);
        
        progressBar.style.height = `${progress}%`;

        const items = container.querySelectorAll('.timeline-item');
        items.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const dot = item.querySelector('.timeline-dot');
            const dotInner = item.querySelector('.dot-inner');
            if (itemRect.top < windowHeight * 0.75) {
                dot.classList.add('active-dot');
                if (dotInner) dotInner.classList.remove('opacity-40');
            } else {
                dot.classList.remove('active-dot');
                if (dotInner) dotInner.classList.add('opacity-40');
            }
        });
    }
}

/* Render Profil Mempelai */
function renderProfiles() {
    const profileContainer = document.getElementById('profile-container');
    if (!profileContainer || !CONFIG.wedding) return;
    const p = CONFIG.wedding.pria;
    const w = CONFIG.wedding.wanita;

    profileContainer.innerHTML = `
        <div class="text-center space-y-3 mb-8">
            <h2 class="font-serif text-3xl sm:text-4xl font-bold text-amber-300">Pasangan Mempelai</h2>
        </div>
        <div class="grid md:grid-cols-2 gap-8 items-stretch">
            <div class="bg-[#1f0d14] border border-amber-400/30 p-6 rounded-3xl text-center shadow-md hover:shadow-xl transition-all h-full flex flex-col justify-between space-y-4 relative overflow-hidden" data-aos="zoom-in-right">
                <div class="space-y-4">
                    <div class="relative w-36 h-36 mx-auto">
                        <img src="${p.foto}" class="w-full h-full rounded-full object-cover border-4 border-amber-400/80 shadow-lg">
                        <div class="absolute inset-0 rounded-full border-2 border-rose-400/40 transform scale-105"></div>
                    </div>
                    <div class="min-h-[72px] flex items-center justify-center">
                        <h3 class="font-serif text-2xl font-bold text-rose-50 leading-snug">${p.nama}</h3>
                    </div>
                    <p class="text-xs text-rose-200/70 leading-relaxed">${p.orangTua}</p>
                </div>
                <div class="pt-2">
                    <a href="https://instagram.com/${p.instagram.replace('@','')}" target="_blank" class="inline-flex items-center space-x-2 text-xs text-amber-300 hover:text-amber-200 transition-colors bg-[#2a1219] px-3.5 py-1.5 rounded-full border border-amber-400/30">
                        <i class="fa-brands fa-instagram text-amber-300"></i><span>${p.instagram}</span>
                    </a>
                </div>
            </div>

            <div class="bg-[#1f0d14] border border-amber-400/30 p-6 rounded-3xl text-center shadow-md hover:shadow-xl transition-all h-full flex flex-col justify-between space-y-4 relative overflow-hidden" data-aos="zoom-in-left">
                <div class="space-y-4">
                    <div class="relative w-36 h-36 mx-auto">
                        <img src="${w.foto}" class="w-full h-full rounded-full object-cover border-4 border-amber-400/80 shadow-lg">
                        <div class="absolute inset-0 rounded-full border-2 border-rose-400/40 transform scale-105"></div>
                    </div>
                    <div class="min-h-[72px] flex items-center justify-center">
                        <h3 class="font-serif text-2xl font-bold text-rose-50 leading-snug">${w.nama}</h3>
                    </div>
                    <p class="text-xs text-rose-200/70 leading-relaxed">${w.orangTua}</p>
                </div>
                <div class="pt-2">
                    <a href="https://instagram.com/${w.instagram.replace('@','')}" target="_blank" class="inline-flex items-center space-x-2 text-xs text-amber-300 hover:text-amber-200 transition-colors bg-[#2a1219] px-3.5 py-1.5 rounded-full border border-amber-400/30">
                        <i class="fa-brands fa-instagram text-amber-300"></i><span>${w.instagram}</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}

/* Render Jadwal Acara */
function renderSchedules() {
    const schedContainer = document.getElementById('schedule-container');
    if (!schedContainer || !CONFIG.schedules) return;
    schedContainer.innerHTML = '';
    CONFIG.schedules.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'bg-[#1f0d14] border border-amber-400/20 rounded-2xl overflow-hidden shadow-lg text-center space-y-4 group transition-all duration-300 hover:border-amber-400/50 flex flex-col justify-between';
        card.setAttribute('data-aos', index % 2 === 0 ? 'fade-right' : 'fade-left');
        card.innerHTML = `
            <div>
                ${item.image ? `<div class="h-44 w-full overflow-hidden relative"><img src="${item.image}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"><div class="absolute inset-0 bg-gradient-to-t from-[#14080b] to-transparent"></div></div>` : ''}
                <div class="p-5 space-y-2">
                    <h3 class="font-serif text-2xl font-bold text-amber-300">${item.name}</h3>
                    <p class="text-rose-200 text-sm font-semibold border-y border-amber-400/20 py-1 inline-block px-3">${item.time}</p>
                    <p class="text-xs text-rose-200/70 leading-relaxed">${item.location}<br>${item.address}</p>
                </div>
            </div>
            <div class="p-5 pt-0">
                <a href="${item.mapsUrl || '#'}" target="_blank" class="inline-flex items-center justify-center space-x-2 w-full py-2.5 bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 text-white font-bold text-xs rounded-xl hover:from-rose-400 hover:to-amber-400 transition-all shadow-md">
                    <i class="fa-solid fa-map-location-dot text-xs"></i>
                    <span>Lokasi ${item.name}</span>
                </a>
            </div>
        `;
        schedContainer.appendChild(card);
    });
}

/* Render Galeri Foto */
function renderGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid || !CONFIG.gallery) return;
    galleryGrid.innerHTML = '';
    CONFIG.gallery.forEach((url, idx) => {
        const wrap = document.createElement('div');
        wrap.className = 'overflow-hidden rounded-2xl border border-amber-400/20 shadow-md group cursor-pointer relative';
        wrap.setAttribute('data-aos', 'zoom-in');
        wrap.setAttribute('data-aos-delay', (idx * 100).toString());
        wrap.innerHTML = `
            <img src="${url}" class="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500">
            <div class="absolute inset-0 bg-[#14080b]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-amber-300 text-xl">
                <i class="fa-solid fa-magnifying-glass-plus"></i>
            </div>
        `;
        wrap.addEventListener('click', () => openGalleryModal(url));
        galleryGrid.appendChild(wrap);
    });
}

function openGalleryModal(url) {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    if (modal && modalImg) {
        modalImg.src = url;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

/* Logika Hitung Mundur Waktu */
function startCountdown() {
    if (!CONFIG.event || !CONFIG.event.targetDateIso) return;
    const targetTime = new Date(CONFIG.event.targetDateIso).getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const diff = targetTime - now;

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (document.getElementById("days")) document.getElementById("days").innerText = String(days).padStart(2, '0');
            if (document.getElementById("hours")) document.getElementById("hours").innerText = String(hours).padStart(2, '0');
            if (document.getElementById("minutes")) document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
            if (document.getElementById("seconds")) document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
        } else {
            if (document.getElementById("days")) document.getElementById("days").innerText = "00";
            if (document.getElementById("hours")) document.getElementById("hours").innerText = "00";
            if (document.getElementById("minutes")) document.getElementById("minutes").innerText = "00";
            if (document.getElementById("seconds")) document.getElementById("seconds").innerText = "00";
        }
    }

    setInterval(updateTimer, 1000);
    updateTimer();
}

/* Logika Copy Rekening & Toast Notification */
function copyToClipboard(elementId, bankName) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const textToCopy = el.innerText.replace(/\s+/g, '');
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast(`Rekening ${bankName} berhasil disalin!`);
        });
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast(`Rekening ${bankName} berhasil disalin!`);
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => { toast.classList.remove("show"); }, 2500);
}

/* Logika Pemutar Audio Backsound */
const playIconPath = "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z";
const pauseIconPath = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";

function playAudio() {
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    const iconPath = document.getElementById('iconPath');
    
    if (!bgMusic) return;
    bgMusic.play().then(() => {
        if (musicBtn) musicBtn.classList.add('playing');
        if (iconPath) iconPath.setAttribute('d', pauseIconPath);
    }).catch(err => {
        console.log("Autoplay diblokir browser:", err);
    });
}

function toggleMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    const iconPath = document.getElementById('iconPath');
    
    if (!bgMusic) return;
    if (bgMusic.paused) {
        bgMusic.play();
        if (musicBtn) musicBtn.classList.add('playing');
        if (iconPath) iconPath.setAttribute('d', pauseIconPath);
    } else {
        bgMusic.pause();
        if (musicBtn) musicBtn.classList.remove('playing');
        if (iconPath) iconPath.setAttribute('d', playIconPath);
    }
}

/* Mengambil Komentar RSVP */
function fetchComments() {
    const commentsContainer = document.getElementById('comments-container');
    if (!commentsContainer) return;
    if (typeof CONFIG === 'undefined' || !CONFIG.scriptUrl || CONFIG.scriptUrl.includes("PASTER_URL")) {
        commentsContainer.innerHTML = '<p class="text-xs text-rose-200/50 text-center">Belum ada ucapan tersimpan.</p>';
        return;
    }

    commentsContainer.innerHTML = '<p class="text-xs text-amber-300 text-center">Memuat ucapan...</p>';

    fetch(CONFIG.scriptUrl)
        .then(res => res.json())
        .then(data => {
            commentsContainer.innerHTML = '';
            if (!data || data.length === 0) {
                commentsContainer.innerHTML = '<p class="text-xs text-rose-200/50 text-center">Belum ada ucapan. Jadilah yang pertama!</p>';
                return;
            }

            data.forEach(item => {
                const el = document.createElement('div');
                el.className = 'bg-[#1f0d14] border border-amber-400/20 p-3.5 rounded-2xl text-left space-y-1 shadow-sm';
                el.innerHTML = `
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-amber-300 text-sm">${escapeHtml(item.name)}</span>
                        <span class="text-[10px] px-2 py-0.5 rounded-full ${item.status === 'Hadir' ? 'bg-[#2a1219] text-amber-300 border border-amber-400/30' : 'bg-[#14080b] text-rose-200/60'}">${item.status}</span>
                    </div>
                    <p class="text-xs text-rose-100">${escapeHtml(item.message)}</p>
                    <span class="text-[9px] text-rose-200/50 block pt-1">${item.date || ''}</span>
                `;
                commentsContainer.appendChild(el);
            });
        })
        .catch(err => {
            console.error("Gagal memuat ucapan:", err);
            commentsContainer.innerHTML = '<p class="text-xs text-red-400 text-center">Gagal memuat ucapan.</p>';
        });
}

function escapeHtml(text) {
    return text ? text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
}
