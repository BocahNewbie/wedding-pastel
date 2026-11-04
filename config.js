const CONFIG = {
    type: "wedding", 

    event: {
        title: "The Wedding Of",
        dateText: "Sabtu, 16 Januari 2027",
        targetCountdown: "January 16, 2027 08:00:00",
        targetDateIso: "2027-01-16T08:00:00",
        quote: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.",
        quoteSource: "Q.S. Ar-Rum: 21"
    },

    // BACKGROUND UTAMA GLOBAL
    backgrounds: {
        globalPattern: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920"
    },

    // TEKS UCAPAN TERIMA KASIH
    thanks: {
        title: "Terima Kasih",
        message: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.",
        subtext: "Kami Yang Berbahagia,",
        family: "Beserta Keluarga Besar"
    },

    // DATA MEMPELAI & FOTO PROFIL
    couple: {
        bride: "Sri Ina Aristiani",
        groom: "M. Adzka Ramdhani",
        brideInitial: "I",
        groomInitial: "A"
    },
    wedding: {
        pria: {
            nama: "M. Adzka Ramdhani",
            panggilan: "Adzka",
            orangTua: "Putra Pertama dari Bapak Kamaludin & Ibu Dra. Ida Srinurwenda",
            foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500",
            instagram: "@kaka_ramdhani"
        },
        wanita: {
            nama: "Sri Ina Aristiani",
            panggilan: "Ina",
            orangTua: "Putri Bungsu dari Bapak Herman & Ibu Nuryamah",
            foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500",
            instagram: "@iamqueenvanilla"
        }
    },

    googleCalendarUrl: "https://www.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Adzka+%26+Ina&dates=20270116T010000Z/20270116T080000Z",
    audioUrl: "musikiqro.mp3",

    // TIMELINE KISAH CINTA
    loveStory: [
        {
            year: "2024",
            title: "Awal Pertemuan",
            description: "Takdir mempertemukan kami di sebuah tempat. Dari sapaan sederhana hingga menjadi teman diskusi yang hangat."
        },
        {
            year: "2024 - 2026",
            title: "Menjalin Hubungan",
            description: "Memutuskan untuk melangkah bersama, saling memahami satu sama lain, serta membangun impian masa depan."
        },
        {
            year: "2026",
            title: "Lamaran & Restu Keluarga",
            description: "Dengan izin Allah SWT dan restu dari kedua orang tua, kami mengikat niat suci menuju jenjang pernikahan."
        }
    ],

    // JADWAL ACARA & GOOGLE MAPS MASING-MASING
    schedules: [
        {
            name: "Akad Nikah",
            time: "08.00 - 10.00 WIB",
            location: "KUA Purwaharja",
            address: "Banjar, Jawa Barat",
            image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800",
            mapsUrl: "https://maps.google.com"
        },
        {
            name: "Resepsi",
            time: "11.00 WIB - Selesai",
            location: "Rumah Mempelai Wanita",
            address: "Banjar, Jawa Barat",
            image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800",
            mapsUrl: "https://maps.google.com"
        }
    ],

    // GALERI FOTO
    gallery: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800",
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800"
    ],

    // AMPLOP DIGITAL (Mendukung ID untuk fungsionalitas salin otomatis)
    bankAccounts: [
        {
            id: "acc-bca",
            bankName: "BCA",
            bank: "BCA",
            icon: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg",
            accountNumber: "1234567890",
            number: "1234567890",
            accountHolder: "a.n. Muhammad Adzka Ramdhani",
            owner: "Muhammad Adzka Ramdhani"
        },
        {
            id: "acc-bri",
            bankName: "BRI",
            bank: "BRI",
            icon: "https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_2020.svg",
            accountNumber: "0987654321",
            number: "0987654321",
            accountHolder: "a.n. Sri Ina Aristiani",
            owner: "Sri Ina Aristiani"
        }
    ],

    scriptUrl: "https://script.google.com/macros/s/AKfycbyXihP0ICvvo8Y5eLP571MKGXh28DzUMFcIYqOacAMHAPX_J1wWFlJeT3QRft4HLN_vtA/exec"
};
