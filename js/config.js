// data pengaturan dasar bot
const CONFIG = {
    appName: 'StudyMate AI',
    version: '1.0.0',
    hacktivsTheme: 'Pendidikan dan Pembelajaran',
    
    defaultParams: {
        tone: 'santai',
        role: 'tutor',
        detail: 'komprehensif',
        apiProvider: 'built_in',
        apiKey: '',
        customSystemPrompt: ''
    },

    // instruksi role & gaya bicara bot
    systemPrompts: {
        base: `Kamu adalah **StudyMate AI**, chatbot edukasi dan asisten belajar mahasiswa yang cerdas, ramah, dan solutif.
Tugas utamamu adalah membantu mahasiswa memahami materi perkuliahan, algoritma, teori akademik, studi kasus, dan persiapan ujian.
Selalu jawab dalam **Bahasa Indonesia**. Gunakan format Markdown yang rapi (gunakan bold, bullet points, numbered lists, dan code blocks bila perlu).`,
        
        toneModifiers: {
            santai: `Gaya bicaramu santai, ramah, menggunakan bahasa sehari-hari mahasiswa yang sopan (seperti "kamu", "nih", "yuk"), membuat materi berat terasa ringan dan mudah dipahami tanpa mengurangi ketepatan ilmu.`,
            formal: `Gaya bicaramu formal, akademis, terstruktur dengan bahasa baku yang cocok untuk penulisan karya ilmiah, jurnal, atau skripsi.`,
            analogi: `Gaya bicaramu penuh dengan analogi dunia nyata dan contoh sehari-hari yang mudah dibayangkan oleh mahasiswa.`,
            ringkas: `Gaya bicaramu to the point, langsung pada poin utama, menggunakan bullet points ringkas tanpa basa-basi.`
        },

        roleModifiers: {
            tutor: `Peranmu adalah sebagai teman belajar / senior kampus yang siap membimbing step-by-step sampai paham.`,
            dosen: `Peranmu adalah Dosen Pembimbing yang bijak, memberikan penjelasan akademis mendalam disertai arahan literatur dan tips ujian.`,
            quizmaster: `Peranmu adalah Penguji / Quiz Master. Setelah memberikan penjelasan singkat, kamu SELALU memberikan 1-2 pertanyaan kuis interaktif di akhir untuk menguji pemahaman mahasiswa.`,
            coder: `Peranmu adalah Software Engineering Mentor. Penjelasanmu berfokus pada algoritma, struktur data, best practice sintaks kode, dan cara me-debug error.`
        }
    },

    // contoh pertanyaan siap klik
    samplePrompts: [
        {
            subject: 'informatika',
            icon: 'fa-solid fa-code',
            title: 'Algoritma K-Means',
            prompt: 'Apa itu algoritma K-Means Clustering dan bagaimana langkah kerja dasarnya?',
            category: 'Informatika & Data Science'
        },
        {
            subject: 'informatika',
            icon: 'fa-solid fa-network-wired',
            title: 'Beda HTTP vs HTTPS',
            prompt: 'Jelaskan perbedaan mendasar antara protokol HTTP dan HTTPS dengan analogi sederhana.',
            category: 'Informatika & Jaringan'
        },
        {
            subject: 'ekonomi',
            icon: 'fa-solid fa-chart-line',
            title: 'Hukum Penawaran & Permintaan',
            prompt: 'Bagaimana cara kerja Hukum Penawaran dan Permintaan dalam mengontrol harga pasar?',
            category: 'Ekonomi & Bisnis'
        },
        {
            subject: 'ekonomi',
            icon: 'fa-solid fa-money-bill-trend-up',
            title: 'Inflasi vs Deflasi',
            prompt: 'Apa perbedaan Inflasi dan Deflasi, serta dampaknya bagi daya beli mahasiswa?',
            category: 'Ekonomi & Keuangan'
        },
        {
            subject: 'teknik',
            icon: 'fa-solid fa-gear',
            title: 'Prinsip Kerja Hukum Newton',
            prompt: 'Berikan penjelasan dan contoh penerapan Hukum Newton I, II, dan III dalam kehidupan sehari-hari.',
            category: 'Teknik & Fisika'
        },
        {
            subject: 'hukum',
            icon: 'fa-solid fa-scale-balanced',
            title: 'Hukum Pidana vs Perdata',
            prompt: 'Apa perbedaan mendasar antara Hukum Pidana dan Hukum Perdata di Indonesia?',
            category: 'Hukum & Sosial'
        },
        {
            subject: 'kesehatan',
            icon: 'fa-solid fa-heart-pulse',
            title: 'Sistem Imun Tubuh',
            prompt: 'Bagaimana sistem imun tubuh manusia merespons infeksi virus secara biologis?',
            category: 'Kesehatan & Biologi'
        }
    ],

    // rekomendasi pertanyaan lanjutan
    followUpSuggestions: {
        default: [
            'Bisa berikan contoh studi kasus sederhana?',
            'Bagaimana cara menerapkannya dalam tugas kuliah?',
            'Apa kelebihan dan kekurangan konsep ini?',
            'Uji pemahamanku dengan 1 soal singkat!'
        ],
        coding: [
            'Berikan contoh implementasi kode dalam Python/JS!',
            'Bagaimana kompleksitas waktu (Big O) algoritma ini?',
            'Apa perbedaan utamanya dengan alternatif lain?'
        ],
        theoretical: [
            'Jelaskan lagi dengan analogi yang lebih sederhana.',
            'Bisa buatkan rangkuman poin-poin pentingnya?',
            'Apa pertanyaan yang sering keluar saat ujian tentang topik ini?'
        ]
    }
};
