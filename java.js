// =========================================
// PROJECT 6 JAWA.js - KODE FINAL & BERSIH 100%
// =========================================

// 0. WELCOME SCREEN & AUTO-PLAY MUSIK 🎵
document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const enterBtn = document.getElementById('enter-btn');
    const audio = document.querySelector('audio');

    if (enterBtn && welcomeScreen) {
        enterBtn.addEventListener('click', () => {
            // Sembunyikan layar welcome ke atas
            welcomeScreen.classList.add('hidden');
            
            // Putar musik (Syarat dari browser: harus ada klik user dulu baru lagu bisa jalan)
            if (audio) {
                audio.play().catch(error => {
                    console.log("Audio gagal diputar otomatis: ", error);
                });
            }
        });
    }
});

// 1. SCRIPT TRANSISI MENU HALAMAN
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
   const pageIds = ['beranda', 'tentang', 'pengurus', 'anggota', 'jadwal', 'piket', 'galeri', 'media', 'pesan', 'rahasia'];

    function switchPage(targetId) {
        pageIds.forEach(id => {
            const section = document.getElementById(id);
            if (section) section.classList.remove('active-page');
        });
        
        const targetSection = document.getElementById(targetId);
        if (targetSection) targetSection.classList.add('active-page');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    switchPage('beranda');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                switchPage(targetId);
            }
        });
    });
});

// 2. TOMBOL DARK/LIGHT MODE
document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                themeBtn.innerText = '☀️ Mode Terang';
            } else {
                themeBtn.innerText = '🌙 Mode Gelap';
            }
        });
    }
});

// 3. FITUR HITUNG MUNDUR (COUNTDOWN KELULUSAN)
// (Script ini diabaikan karena hitung mundurnya sekarang langsung ada di HTML)

// 4. POP-UP BIODATA KARTU PENGURUS/ANGGOTA
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('biodataModal');
    const closeModal = document.getElementById('closeModal');
    const cards = document.querySelectorAll('.card, .siswa-card');

    const mFullName = document.getElementById('m-fullname');
    const mNickname = document.getElementById('m-nickname');
    const mBirthday = document.getElementById('m-birthday');
    const mHobby = document.getElementById('m-hobby');
    const mEskul = document.getElementById('m-eskul');

    if (modal) {
        cards.forEach(card => {
            card.addEventListener('click', () => {
                if(mFullName) mFullName.innerText = card.getAttribute('data-fullname') || 'Belum diisi';
                if(mNickname) mNickname.innerText = card.getAttribute('data-nickname') || 'Belum diisi';
                if(mBirthday) mBirthday.innerText = card.getAttribute('data-birthday') || 'Belum diisi';
                if(mHobby) mHobby.innerText = card.getAttribute('data-hobby') || 'Belum diisi';
                if(mEskul) mEskul.innerText = card.getAttribute('data-eskul') || 'Belum diisi';
                
                modal.style.display = 'flex';
                modal.classList.add('active');
            });
        });

        if(closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
                modal.classList.remove('active');
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                modal.classList.remove('active');
            }
        });
    }
});

// 5. POP-UP GALERI (LIGHTBOX) - FIX FINAL FOTO AKURAT 📸
document.addEventListener('DOMContentLoaded', () => {
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    
    // MENGAMBIL TARGET SPESIFIK KE TAG GAMBAR (IMG), Bukan bungkusnya!
    const galeriImages = document.querySelectorAll('.galeri-item img'); 

    if (lightboxModal && galeriImages.length > 0) {
        galeriImages.forEach(img => {
            img.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Ambil sumber foto PERSIS dari gambar yang barusan diklik
                if (lightboxImg) {
                    lightboxImg.src = this.src; 
                }
                
                // Memunculkan Pop-up
                lightboxModal.style.display = 'flex';
                lightboxModal.style.opacity = '1';
                lightboxModal.classList.add('active');
            });
        });

        // Tombol Silang X
        if (lightboxClose) {
            lightboxClose.addEventListener('click', (e) => {
                e.preventDefault();
                lightboxModal.style.display = 'none';
                lightboxModal.style.opacity = '0';
                lightboxModal.classList.remove('active');
            });
        }

        // Klik background hitam untuk tutup
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.style.display = 'none';
                lightboxModal.style.opacity = '0';
                lightboxModal.classList.remove('active');
            }
        });
    }
});

// 6. FIREBASE & SISTEM BUKU TAMU & ADMIN GALAXY
const firebaseConfig = {
    apiKey: "AIzaSyB0CE2A6nMgdR4jH-C2QtmcvVJ8Q-lPorQ",
    authDomain: "website-class-9c.firebaseapp.com",
    databaseURL: "https://website-class-9c-default-rtdb.firebaseio.com",
    projectId: "website-class-9c",
    storageBucket: "website-class-9c.firebasestorage.app",
    messagingSenderId: "468787276862",
    appId: "1:468787276862:web:6fbcfbc69183164e8e756f"
};

if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const database = firebase.database();
    const messagesRef = database.ref('pesan_kelas9c');

    window.isAdmin = false;
    let latestMessagesData = null;

    function escapeHtml(text) {
        if (!text) return '';
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function censorName(str) {
        if (!str) return '***';
        return str.split(' ').map(word => {
            if (word.length <= 1) return '*';
            return word[0] + '*'.repeat(word.length - 1);
        }).join(' ');
    }

    document.addEventListener('DOMContentLoaded', () => {
        const messagesList = document.getElementById('messagesList');
        const guestbookForm = document.getElementById('guestbookForm');

        function renderMessagesFromFirebase() {
            if (!messagesList || !latestMessagesData) return;
            messagesList.innerHTML = '';
            
            const messagesArray = [];
            for (let key in latestMessagesData) {
                messagesArray.push({ id: key, ...latestMessagesData[key] });
            }
            messagesArray.reverse();

            messagesArray.forEach((item) => {
                const messageItem = document.createElement('div');
                messageItem.classList.add('message-item');

                const rawName = item.name || 'Anonim';
                const displayName = window.isAdmin ? escapeHtml(rawName) + ' 🔓' : censorName(escapeHtml(rawName));
                const displayClass = escapeHtml(item.userClass || 'IX C');
                const displayMessage = escapeHtml(item.message || '');

                let deleteButtonHTML = `<button class="delete-btn" title="Hapus Pesan" onclick="window.triggerFirebaseDelete('${item.id}', '${escapeHtml(rawName)}')">&times;</button>`;
                
                messageItem.innerHTML = `
                    <h4>${displayName} <span class="user-class">Kelas ${displayClass}</span></h4>
                    <p>${displayMessage}</p>
                    ${deleteButtonHTML}
                `;
                messagesList.appendChild(messageItem);
            });
        }

        messagesRef.on('value', (snapshot) => {
            latestMessagesData = snapshot.val();
            if (latestMessagesData) renderMessagesFromFirebase();
            else if (messagesList) messagesList.innerHTML = '<p style="text-align:center; color:#777;">Belum ada pesan. Jadilah yang pertama!</p>';
        });

        if (guestbookForm) {
            guestbookForm.onsubmit = function(e) {
                e.preventDefault();
                const nameEl = document.getElementById('senderName');
                const classEl = document.getElementById('senderClass');
                const msgEl = document.getElementById('senderMessage');

                if (nameEl && msgEl && nameEl.value.trim() !== "" && msgEl.value.trim() !== "") {
                    messagesRef.push({
                        name: nameEl.value,
                        userClass: classEl && classEl.value.trim() !== "" ? classEl.value : 'IX C',
                        message: msgEl.value,
                        timestamp: Date.now()
                    });
                    guestbookForm.reset();
                    alert("Pesan berhasil dikirim!");
                }
            };
        }

        const adminToggleBtn = document.getElementById('adminToggleBtn');
        const adminModalOverlay = document.getElementById('adminModalOverlay');
        const adminPasswordInput = document.getElementById('adminPasswordInput');
        const adminSubmitBtn = document.getElementById('adminSubmitBtn');
        const adminCancelBtn = document.getElementById('adminCancelBtn');

        if (adminToggleBtn && adminModalOverlay) {
            adminToggleBtn.onclick = function(e) {
                e.preventDefault();
                if (window.isAdmin) {
                    window.isAdmin = false;
                    document.body.classList.remove('admin-mode'); 
                    alert("Mode Admin dimatikan. Sensor nama kembali aktif.");
                    adminToggleBtn.innerText = "🔐 Mode Admin";
                    renderMessagesFromFirebase(); 
                } else {
                    adminModalOverlay.style.display = 'flex';
                    adminModalOverlay.classList.add('active');
                    if (adminPasswordInput) {
                        adminPasswordInput.value = '';
                        adminPasswordInput.focus();
                    }
                }
            };
        }

        if (adminCancelBtn) {
            adminCancelBtn.onclick = function(e) {
                e.preventDefault();
                adminModalOverlay.style.display = 'none';
                adminModalOverlay.classList.remove('active');
            };
        }

        if (adminSubmitBtn) {
            adminSubmitBtn.onclick = function(e) {
                e.preventDefault();
                if (adminPasswordInput && adminPasswordInput.value === "streak") {
                    window.isAdmin = true;
                    document.body.classList.add('admin-mode'); 
                    adminModalOverlay.style.display = 'none';
                    adminModalOverlay.classList.remove('active');
                    alert("Mode Admin Aktif! Semua nama sekarang terlihat.");
                    if (adminToggleBtn) adminToggleBtn.innerText = "🔓 Keluar Mode Admin";
                    renderMessagesFromFirebase(); 
                } else {
                    alert("Password salah!");
                    if (adminPasswordInput) adminPasswordInput.value = '';
                }
            };
        }

        window.triggerFirebaseDelete = function(firebaseId, originalName) {
            if (window.isAdmin) {
                const deleteAdminModal = document.getElementById('deleteAdminModal');
                if (deleteAdminModal) {
                    deleteAdminModal.style.display = 'flex';
                    deleteAdminModal.classList.add('active');
                    
                    const btnSubmit = document.getElementById('deleteAdminSubmitBtn');
                    const btnCancel = document.getElementById('deleteAdminCancelBtn');
                    
                    if (btnCancel) btnCancel.onclick = (e) => {
                        e.preventDefault();
                        deleteAdminModal.style.display = 'none';
                        deleteAdminModal.classList.remove('active');
                    };
                    
                    if (btnSubmit) btnSubmit.onclick = (e) => {
                        e.preventDefault();
                        messagesRef.child(firebaseId).remove();
                        deleteAdminModal.style.display = 'none';
                        deleteAdminModal.classList.remove('active');
                        alert("Pesan berhasil dihapus oleh Admin!");
                    };
                }
            } else {
                const deleteUserModal = document.getElementById('deleteUserModal');
                if (deleteUserModal) {
                    deleteUserModal.style.display = 'flex';
                    deleteUserModal.classList.add('active');
                    
                    const deleteUserNameInput = document.getElementById('deleteUserNameInput');
                    if (deleteUserNameInput) {
                        deleteUserNameInput.value = '';
                        deleteUserNameInput.focus();
                    }

                    const btnSubmit = document.getElementById('deleteUserSubmitBtn');
                    const btnCancel = document.getElementById('deleteUserCancelBtn');

                    if (btnCancel) btnCancel.onclick = (e) => {
                        e.preventDefault();
                        deleteUserModal.style.display = 'none';
                        deleteUserModal.classList.remove('active');
                    };
                    
                    if (btnSubmit) btnSubmit.onclick = (e) => {
                        e.preventDefault();
                        const confirmName = deleteUserNameInput ? deleteUserNameInput.value : '';
                        if (confirmName && confirmName.trim().toLowerCase() === originalName.trim().toLowerCase()) {
                            messagesRef.child(firebaseId).remove();
                            deleteUserModal.style.display = 'none';
                            deleteUserModal.classList.remove('active');
                            alert("Pesan berhasil dihapus!");
                        } else {
                            alert("Nama tidak cocok! Kamu hanya bisa menghapus pesan yang kamu kirim sendiri.");
                        }
                    };
                }
            }
        };
    });
}
// =========================================
// 0. WELCOME SCREEN, WAITING LOADING & MUSIC AUTO-PLAY 🎵
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const enterBtn = document.getElementById('enter-btn');
    const welcomeInitial = document.getElementById('welcome-initial');
    const welcomeLoader = document.getElementById('welcome-loader');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const audio = document.querySelector('audio');

    if (enterBtn && welcomeScreen) {
        enterBtn.addEventListener('click', () => {
            // 1. Putar musik langsung saat diklik
            if (audio) {
                audio.play().catch(error => console.log("Audio ditahan browser: ", error));
            }

            // 2. Sembunyikan tombol "Masuk", lalu munculkan tampilan Waiting / Loading
            if (welcomeInitial) welcomeInitial.style.display = 'none';
            if (welcomeLoader) welcomeLoader.style.display = 'block';

            // 3. Jalankan efek hitungan persentase 0% -> 100% (DURASI 3-4 DETIK)
            let percent = 0;
            const loadingInterval = setInterval(() => {
                // Angka naik 1% sampai 3% setiap ketukan biar pas durasinya sekitar 2.5 detik
                percent += Math.floor(Math.random() * 1 + 30 & 50);

                if (percent >= 100) {
                    percent = 100;
                    clearInterval(loadingInterval);

                    // Pastikan visual mentok di 100%
                    if (progressBar) progressBar.style.width = '100%';
                    if (progressText) progressText.innerText = '100%';

                    // 4. Tahan selama 1 DETIK PENUH di angka 100% biar mantap
                    setTimeout(() => {
                        // Tambahkan animasi terangkat/memudar
                        welcomeScreen.classList.add('hidden');
                        
                        // JURUS PAMUNGKAS: Hapus total layar agar halaman Beranda bisa diklik
                        setTimeout(() => {
                            welcomeScreen.style.display = 'none';
                        }, 5000);
                        
                    }, 5000); // 1000 milidetik = 1 detik penahanan
                } else {
                    // Update tampilan angka dan garis warna saat belum 100%
                    if (progressBar) progressBar.style.width = percent + '%';
                    if (progressText) progressText.innerText = percent + '%';
                }

            }, 50); // Kecepatan ketukan diatur ke 50 milidetik
        });
    }
});
// =========================================
// 8. FITUR EASTER EGG (KUIS MTK UNTUK BUKA AIB) 🤫
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const btnTebak = document.getElementById('btn-tebak');
    const kuisRahasia = document.getElementById('kuis-rahasia');
    const galeriAib = document.getElementById('galeri-aib');

    if (btnTebak) {
        btnTebak.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Ambil jawaban dari kotak input
            const j1 = document.getElementById('jawaban1').value.trim();
            const j2 = document.getElementById('jawaban2').value.trim();
            const j3 = document.getElementById('jawaban3').value.trim();

            // KUNCI JAWABAN: Soal 1 = 28, Soal 2 = 17, Soal 3 = 50
            if (j1 === "28" && j2 === "17" && j3 === "50") {
                // Jika semua benar
                alert("BINGOOO! 😈 Jawaban MTK benar semua! Bersiaplah melihat aib kelas!");
                
                if (kuisRahasia) kuisRahasia.style.display = 'none'; // Sembunyikan soal MTK-nya
                if (galeriAib) galeriAib.style.display = 'block';  // Munculkan foto-foto aibnya!
                
                // Sedikit efek gulir otomatis ke galeri
                if (galeriAib) window.scrollTo({ top: galeriAib.offsetTop - 80, behavior: 'smooth' });
                
            } else {
                // Jika ada yang salah
                alert("TETOOOT! ❌ Jawaban MTK ada yang salah. Ayo hitung lagi, kamu belum berhak melihat rahasia IX C!");
            }
        });
    }
});