# 🎓 StudyMate AI — Chatbot Edukasi & Asisten Belajar Mahasiswa
> **Final Project HACKTIVS — Theme: Pendidikan dan Pembelajaran**

![StudyMate AI Banner](https://img.shields.io/badge/HACKTIVS-Final%20Project-6366f1?style=for-the-badge&logo=graduation-cap)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![AI-Powered](https://img.shields.io/badge/AI--Engine-Gemini%20%7C%20OpenRouter%20%7C%20Smart%20Tutor-06b6d4?style=for-the-badge)

---

## 📌 A. Identitas Proyek

| Komponen | Keterangan |
| :--- | :--- |
| **Nama Chatbot** | **StudyMate AI** |
| **Tema** | Pendidikan dan Pembelajaran |
| **Jenis Aplikasi** | Website Chatbot (Single Page Web Application) |
| **Target Pengguna** | Mahasiswa & Pelajar |
| **Model AI Engine** | Multi-Provider (Google Gemini API, OpenRouter API, & Standalone Smart Study Engine) |
| **Tujuan Utama** | Membantu mahasiswa memahami materi perkuliahan yang rumit melalui percakapan interaktif |
| **Bahasa Utama** | Bahasa Indonesia |
| **Gaya Bahasa** | Santai, ramah, sederhana, dan kaya analogi |

---

## 💡 B. Ide, Background & Use Case

### 1. Latar Belakang
Mahasiswa seringkali mengalami kesulitan dalam memahami materi perkuliahan dengan konsep kompleks (seperti algoritma *Machine Learning*, persamaan fisika, hukum pidana/perdata, maupun teori ekonomi). Penjelasan di buku teks yang kaku sering membuat belajar mandiri menjadi kurang efisien.

### 2. Solusi StudyMate AI
**StudyMate AI** dirancang sebagai teman belajar interaktif berbasis AI yang menyederhanakan bahasa akademis yang kaku menjadi mudah dipahami, dilengkapi dengan analogi nyata, contoh kode program, penulisan rumus matematika (LaTeX), serta fitur interaktif suara (Speech-to-Text & Text-to-Speech).

### 3. Alur Penggunaan (Use Case)
1. **Membuka Website:** Pengguna disambut oleh rekomendasi pertanyaan dan kategori mata kuliah.
2. **Mengirim Pertanyaan:** Pengguna memilih atau mengetik pertanyaan materi (misal: *"Apa itu algoritma K-Means?"*).
3. **Pemrosesan AI:** Chatbot memproses pertanyaan sesuai dengan **Parameter System Prompt** yang aktif.
4. **Respon Interaktif:** Chatbot memberikan penjelasan bertahap lengkap dengan contoh kode / analogi, tombol salin, dan audio pembaca suara.
5. **Diskusi Lanjutan:** Pengguna dapat mengklik *Pertanyaan Lanjutan (Follow-up Chips)* untuk memperdalam pemahaman.

---

## 🎛️ C. Konfigurasi Parameter AI (Creative Parameters)

Chatbot ini menyediakan kontrol parameter dinamis yang dapat disesuaikan langsung oleh pengguna melalui menu **Parameter Settings**:

| Parameter | Opsi Konfigurasi | Dampak pada Respon AI |
| :--- | :--- | :--- |
| **Gaya Bahasa (Tone)** | Santai, Formal, Analogi, Ringkas | Mengatur gaya penulisan AI (dari ramah khas mahasiswa hingga formal akademis skripsi). |
| **Peran AI (Persona)** | Teman Belajar, Dosen Pembimbing, Quiz Master, Coding Mentor | Mengubah kepribadian AI (Quiz Master akan otomatis menambahkan soal kuis di akhir). |
| **Kedalaman Response** | Komprehensif, Standar, Singkat | Mengatur detail penjabaran materi. |
| **Provider Model AI** | Built-in Smart Study Engine, Google Gemini API, OpenRouter API | Memungkinkan pengguna memakai API Key sendiri atau menggunakan mode offline bawaan. |
| **System Prompt Custom** | Textarea Instruksi Sistem | Memberikan instruksi tambahan yang langsung digabungkan ke model LLM. |

---

## ✨ D. Fitur Utama & Fitur Tambahan

### 1. Fitur Utama (Core Features)
* 💬 **Chat Percakapan Interaktif:** Input pertanyaan dan tampilan balasan AI secara *real-time stream*.
* 🧠 **Sistem Memory Context:** AI mengingat riwayat percakapan sebelumnya untuk pertanyaan lanjutan.
* 🏷️ **Kategori Mata Kuliah:** Filter pertanyaan rekomendasi berdasarkan *Informatika, Ekonomi, Teknik, Hukum, Kesehatan*.
* 🎛️ **Kustomisasi Parameter UI:** Modal pengaturan gaya bahasa, persona, dan model AI.

### 2. Fitur Tambahan (Value-Added Features)
* 🎙️ **Input Suara (Speech-to-Text):** Mengetik pesan menggunakan perintah suara Bahasa Indonesia.
* 🔊 **Pembaca Suara (Text-to-Speech):** AI dapat membacakan penjelasan materi secara langsung.
* 📝 **Markdown & Code Syntax Highlighting:** Tampilan kode program rapi dengan tombol *Copy Code*.
* 📐 **Rumus Matematika (KaTeX):** Format penulisan rumus LaTeX ($E = mc^2$, matriks, limit).
* 📥 **Ekspor Percakapan:** Simpan riwayat belajar ke file `.md` (Markdown).
* 🌙 **Mode Gelap / Terang (Dark/Light Theme):** Kenyamanan mata saat belajar malam hari.
* 🗑️ **Hapus & Kelola Riwayat:** Manajemen sesi percakapan tersimpan aman di `localStorage` browser.

---

## 📂 E. Struktur Folder Proyek

```text
StudyMate-AI/
├── index.html          # Struktur utama halaman web (HTML5)
├── css/
│   └── style.css       # Sistem desain CSS (Glassmorphism, CSS Variables, Responsive Layout)
├── js/
│   ├── config.js       # Konfigurasi parameter default, system prompts, & sample prompts
│   ├── ai-service.js   # Integration layer (Gemini API, OpenRouter API, & Smart Engine)
│   └── app.js          # Controller aplikasi, event listener, state manager, & Markdown renderer
├── README.md           # Dokumentasi resmi proyek Final HACKTIVS
└── .gitignore          # File penyaring git
```

---

## 🚀 F. Cara Menjalankan Aplikasi secara Lokal

1. **Clone Repositori GitHub:**
   ```bash
   git clone https://github.com/username/studymate-ai.git
   cd studymate-ai
   ```

2. **Jalankan HTTP Server (Tanpa perlu install Node.js):**
   - Menggunakan Python:
     ```bash
     python -m http.server 8000
     ```
   - Atau menggunakan Live Server di VS Code (Klik kanan pada `index.html` -> *Open with Live Server*).

3. **Buka Browser:**
   Akses `http://localhost:8000` di browser favorit Anda.

---

## 🖼️ G. Tangkapan Layar (UI Screenshots)

1. **Tampilan Utama & Chatbot (Dark Mode):**
   Tampilan bersih dengan sidebar riwayat belajar, chip mata kuliah, dan kartu selamat datang.
2. **Penjelasan Materi (Markdown & Code Block):**
   Jawaban AI lengkap dengan sintaks kode Python `KMeans` dan tombol copy.
3. **Modal Konfigurasi Parameter:**
   Pengaturan gaya bahasa, persona AI, dan pilihan provider LLM API.

---

## 🎓 Pengumpulan Final Project HACKTIVS
- **Deliverables:** Repositori GitHub & Screenshot User Interface
- **Status Proyek:** Fully Functional & Ready for Evaluation.
