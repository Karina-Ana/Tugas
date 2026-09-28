/* ==========================================================================
   StudyMate AI — AI Service & API Integration Layer
   Supports: Google Gemini API, OpenRouter API, and Built-in Educational AI Engine
   ========================================================================== */

class AIService {
    constructor() {
        this.knowledgeBase = this.initKnowledgeBase();
    }

    /**
     * Generate response from AI based on current parameters and user query
     * @param {Array} history - Array of {role, content} conversation history
     * @param {Object} params - User parameters (tone, role, detail, provider, apiKey, etc.)
     * @returns {Promise<string>} AI response text
     */
    async generateResponse(history, params) {
        const provider = params.apiProvider || 'built_in';

        if (provider === 'gemini' && params.apiKey) {
            return await this.callGeminiAPI(history, params);
        } else if (provider === 'openrouter' && params.apiKey) {
            return await this.callOpenRouterAPI(history, params);
        } else {
            // Built-in Smart Educational AI Engine
            return await this.generateBuiltInResponse(history, params);
        }
    }

    /**
     * Call Google Gemini API
     */
    async callGeminiAPI(history, params) {
        const apiKey = params.apiKey.trim();
        const systemInstruction = this.buildSystemInstruction(params);
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // Transform history to Gemini format
        const contents = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const requestBody = {
            system_instruction: {
                parts: [{ text: systemInstruction }]
            },
            contents: contents,
            generationConfig: {
                temperature: params.tone === 'formal' ? 0.3 : 0.7,
                maxOutputTokens: 1500
            }
        };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || `Gemini API Error: ${response.statusText}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) throw new Error('Respon dari Gemini kosong.');
            return text;
        } catch (err) {
            console.warn('Gemini API call failed, falling back to Built-in Engine:', err);
            throw new Error(`Gagal menghubungkan ke Gemini API: ${err.message}`);
        }
    }

    /**
     * Call OpenRouter API
     */
    async callOpenRouterAPI(history, params) {
        const apiKey = params.apiKey.trim();
        const systemInstruction = this.buildSystemInstruction(params);
        const endpoint = 'https://openrouter.ai/api/v1/chat/completions';

        const messages = [
            { role: 'system', content: systemInstruction },
            ...history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }))
        ];

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'StudyMate AI'
                },
                body: JSON.stringify({
                    model: 'meta-llama/llama-3.1-8b-instruct:free',
                    messages: messages
                })
            });

            if (!response.ok) throw new Error(`OpenRouter HTTP error! status: ${response.status}`);
            const data = await response.json();
            return data.choices?.[0]?.message?.content || 'Tidak ada respon.';
        } catch (err) {
            throw new Error(`Gagal me-reach OpenRouter API: ${err.message}`);
        }
    }

    /**
     * Build system instruction based on parameters
     */
    buildSystemInstruction(params) {
        let sys = CONFIG.systemPrompts.base + '\n\n';
        sys += CONFIG.systemPrompts.toneModifiers[params.tone || 'santai'] + '\n';
        sys += CONFIG.systemPrompts.roleModifiers[params.role || 'tutor'] + '\n';
        if (params.customSystemPrompt) {
            sys += `\nInstruksi Tambahan Pengguna: ${params.customSystemPrompt}`;
        }
        return sys;
    }

    /**
     * Built-in Smart Educational AI Engine
     * Simulates intelligent, tailored educational responses based on subject context & query
     */
    async generateBuiltInResponse(history, params) {
        // Simulate thinking latency (800ms - 1500ms)
        await new Promise(r => setTimeout(r, 900 + Math.random() * 600));

        const lastUserMessage = history[history.length - 1]?.content || '';
        const lowerQuery = lastUserMessage.toLowerCase();
        const tone = params.tone || 'santai';
        const role = params.role || 'tutor';

        // Check Knowledge Base Match
        let content = '';
        const match = this.knowledgeBase.find(item => item.keywords.some(kw => lowerQuery.includes(kw)));

        if (match) {
            content = match.getResponse(tone, role, lowerQuery);
        } else {
            // General Student Helper Generator
            content = this.generateGeneralResponse(lastUserMessage, tone, role);
        }

        // Quizmaster Role Addon
        if (role === 'quizmaster') {
            content += `\n\n---\n🎯 **Kuis Singkat Pemahaman:**\nBerdasarkan penjelasan di atas, menurut kamu apa hal paling krusial yang membedakan konsep ini? Cobalah jawab di chat bawah ini!`;
        }

        return content;
    }

    /**
     * General academic response synthesizer for arbitrary student queries
     */
    generateGeneralResponse(query, tone, role) {
        if (tone === 'formal') {
            return `### Analisis dan Penjelasan Konsep: "${query}"

Berdasarkan tinjauan literatur akademis, pertanyaan mengenai **${query}** dapat dijelaskan melalui beberapa pemahaman dasar:

1. **Definisi Utama:**
   Topik ini berkaitan erat dengan studi fundamental yang mempelajari prinsip kerja dasar, mekanisme sistem, dan struktur yang mendasarinya.

2. **Karakteristik & Fungsi Utama:**
   - **Optimasi:** Membantu efisiensi proses dalam analisis materi.
   - **Penerapan:** Digunakan sebagai kerangka kerja (*framework*) pemecahan masalah dalam berbagai skenario akademik.

3. **Kesimpulan Akademis:**
   Memahami konsep ini secara holistik sangat penting untuk menerapkan teori ke dalam studi kasus nyata maupun tugas riset perkuliahan.

*Apakah ada bagian spesifik dari variabel atau prinsip tersebut yang ingin Anda pendalam lebih lanjut?*`;
        }

        if (tone === 'analogi') {
            return `### 💡 Cara Mudah Memahami: "${query}"

Bayangkan kamu sedang berada di sebuah perpustakaan kampus yang sangat besar:

- **Konsep dasarnya:** Sama seperti saat kamu ingin mencari buku tertentu tanpa harus membuka satu per satu rak, kamu butuh **sistem pengindeksan** atau panduan.
- **Bagaimana cara kerjanya?** 
  Topik **"${query}"** bekerja persis seperti asisten perpustakaan yang mengarahkan kamu langsung ke tempat terbaik dengan cepat dan efisien.

**Kenapa ini penting buat mahasiswa?**
Tanpa pemahaman konsep ini, proses penyelesaian tugas akan memakan waktu 10x lebih lama!

Gimana, analoginya bikin lebih bayang kan? Ada bagian yang masih bikin penasaran?`;
        }

        if (tone === 'ringkas') {
            return `### 📌 Poin Ringkas: "${query}"

- **Definisi:** Konsep inti yang dipelajari untuk menyelesaikan masalah perkuliahan.
- **Fungsi Utama:**
  1. Mempercepat analisis data/materi.
  2. Menjaga struktur solusi tetap sistematis.
  3. Mengurangi potensi kesalahan (*error*).
- **Penerapan Ringkas:** Digunakan pada tugas makalah, algoritma pemrograman, dan studi kasus ujian.

*Tanyakan jika ingin penjelasan kode atau rumus lengkapnya!*`;
        }

        // Default: Santai & Sederhana
        return `Halo! Pertanyaan yang menarik banget nih mengenai **"${query}"**! 🎓

Mari kita bedah bareng-bareng secara sederhana ya:

### 1. Apa Inti Konsepnya?
Topik **"${query}"** sebenarnya adalah prinsip dasar yang sering muncul di materi perkuliahan untuk membantu kita menyelesaikan masalah secara efisien dan terstruktur.

### 2. Poin Penting yang Wajib Kamu Ingat:
- **Poin Utama:** Menjadi fondasi dasar dalam menganalisis materi atau kasus.
- **Penerapan Praktis:** Sering keluar saat soal ujian mid/final semester atau pembuatan proyek praktikum.
- **Tips Belajar:** Pahami alur atau logika utamanya dulu sebelum menghafal istilah rumitnya.

### 3. Contoh Sederhana dalam Kehidupan Mahasiswa:
Mirip seperti saat kamu menyusun jadwal belajar H-1 ujian — kamu bakal memprioritaskan bab mana yang paling sering keluar agar belajar jadi optimal!

Gimana, paham kan? Mau kita coba bahas contoh soal atau kasus lanjutannya? 😊`;
    }

    /**
     * Pre-populated rich knowledge base for educational queries
     */
    initKnowledgeBase() {
        return [
            {
                keywords: ['k-means', 'kmeans', 'clustering', 'klastering'],
                getResponse: (tone) => `### 📊 Algoritma K-Means Clustering

**K-Means** adalah salah satu algoritma *Unsupervised Machine Learning* yang digunakan untuk mengelompokkan data ke dalam $K$ buah kelompok (cluster) berdasarkan kemiripan karakternya.

---

### 💡 Analogi Sederhana
Bayangkan kamu punya **sekeranjang buah campuran** (apel, jeruk, anggur). Kamu ingin memisahkan buah-buah ini ke dalam 3 wadah ($K=3$) berdasarkan ukuran dan warnanya tanpa ada petunjuk label sebelumnya. K-Means bekerja persis seperti ini!

---

### ⚙️ Langkah Kerja Algoritma (Step-by-Step):

1. **Tentukan Jumlah Cluster ($K$):** Misal kita pilih $K = 3$.
2. **Pilih Titik Pusat (Centroid) Awal:** Pilih 3 titik acak sebagai pusat centroid sementara.
3. **Hitung Jarak (Euclidean Distance):** Hitung jarak setiap titik data ke masing-masing centroid:
   $$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$
4. **Kelompokkan Data:** Masukkan data ke centroid terdekat.
5. **Update Centroid:** Hitung ulang rata-rata posisi centroid dari anggota kelompoknya.
6. **Ulangi (Iterasi):** Proses berulang sampai posisi centroid stabil (tidak berubah lagi).

---

### 💻 Contoh Code Python Sederhana:
\`\`\`python
from sklearn.cluster import KMeans
import numpy as np

# Data contoh (misal: [Tinggi, Berat])
X = np.array([[170, 65], [160, 55], [175, 70], [155, 50], [180, 80]])

# Inisialisasi K-Means dengan K=2
kmeans = KMeans(n_clusters=2, random_state=0)
kmeans.fit(X)

# Hasil Cluster tiap data
print("Label Cluster:", kmeans.labels_)
print("Pusat Centroid:", kmeans.cluster_centers_)
\`\`\`

Ada pertanyaan mengenai rumus Euclidean Distance atau cara menentukan nilai $K$ terbaik (Elbow Method)?`
            },
            {
                keywords: ['http', 'https', 'protokol', 'ssl', 'tls'],
                getResponse: () => `### 🌐 Perbedaan HTTP vs HTTPS

| Fitur | HTTP (Hypertext Transfer Protocol) | HTTPS (HTTP Secure) |
| :--- | :--- | :--- |
| **Keamanan** | Tidak terenkripsi (Plain Text) | Terenkripsi (SSL/TLS Certificate) |
| **Port Standard** | Port 80 | Port 443 |
| **Kecepatan** | Sangat cepat (tanpa handshake SSL) | Sangat cepat + Aman |
| **Penggunaan** | Website lokal / testing | E-commerce, Login, Banking |

---

### 💡 Analogi Surat Pos vs Surat Brankas
- **HTTP:** Seperti mengirim **kartu pos**. Siapapun di kantor pos (hacker/ISP) bisa membaca isi tulisan di kartu pos tersebut saat perjalanan.
- **HTTPS:** Seperti memasukkan surat ke dalam **brankas baja tergembok**. Hanya kamu dan penerima yang punya kunci dekripsinya!`
            },
            {
                keywords: ['penawaran', 'permintaan', 'demand', 'supply', 'ekonomi'],
                getResponse: () => `### 📈 Hukum Penawaran & Permintaan (Supply & Demand)

Dalam ilmu Ekonomi, **Hukum Permintaan & Penawaran** menentukan bagaimana harga barang dan jumlah barang terbentuk di pasar persaingan bebas.

---

### 1. Hukum Permintaan (Demand)
> *"Jika harga suatu barang naik, maka jumlah barang yang diminta akan turun. Sebaliknya, jika harga turun, permintaan akan naik (ceteris paribus)."*

- **Grafik:** Kurva permintaan miring dari kiri atas ke kanan bawah (kemiringan negatif).

### 2. Hukum Penawaran (Supply)
> *"Jika harga barang naik, produsen cenderung menambah jumlah barang yang ditawarkan untuk meraih untung lebih besar."*

- **Grafik:** Kurva penawaran miring dari kiri bawah ke kanan atas (kemiringan positif).

---

### ⚖️ Titik Keseimbangan (Equilibrium)
Keseimbangan pasar terjadi saat **Jumlah Permintaan = Jumlah Penawaran** ($Q_d = Q_s$). Pada titik inilah harga pasar terbentuk secara stabil!`
            },
            {
                keywords: ['newton', 'hukum newton', 'fisika', 'gaya'],
                getResponse: () => `### 🍎 Hukum Gerak Newton (Fisika Dasar)

Sir Isaac Newton merumuskan 3 Hukum Gerak dasar yang menjadi fondasi mekanika klasik:

---

### 1. Hukum I Newton (Inersia / Kelembaman)
$$\\sum \\vec{F} = 0$$
* Benda yang diam akan tetap diam, dan benda bergerak akan tetap bergerak lurus beraturan kecuali ada gaya luar yang memengaruhinya.
* **Contoh:** Saat mobil direm mendadak, tubuh kita terdorong ke depan.

---

### 2. Hukum II Newton (Percepatan)
$$\\vec{F} = m \\cdot \\vec{a}$$
* Percepatan ($a$) suatu benda berbanding lurus dengan total gaya ($F$) dan berbanding terbalik dengan massanya ($m$).
* **Contoh:** Mendorong troli belanja kosong jauh lebih ringan daripada menggenjot troli penuh barang.

---

### 3. Hukum III Newton (Aksi - Reaksi)
$$\\vec{F}_{aksi} = -\\vec{F}_{reaksi}$$
* Setiap gaya aksi akan menimbulkan gaya reaksi yang besarnya sama namun arahnya berlawanan.
* **Contoh:** Peluncuran roket (gas menyembur ke bawah, roket terdorong ke atas).`
            }
        ];
    }
}
