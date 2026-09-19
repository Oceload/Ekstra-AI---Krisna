🤖 RPS ROBOT BATTLE

⚡ Rock • Paper • Scissors — Graffiti Robot Arena

RPS Robot Battle adalah game Batu, Gunting, Kertas berbasis web yang menggunakan kamera dan AI image classification dari Google Teachable Machine.

Pemain menggunakan gesture tangan di depan kamera untuk menentukan pilihan:

- ✊ Rock / Batu
- 🖐️ Paper / Kertas
- ✌️ Scissors / Gunting

Setelah gesture terdeteksi, pemain akan melawan robot secara otomatis.

---

🎮 Features

- 🤖 Teachable Machine image classification
- 📷 Real-time webcam detection
- 🧠 TensorFlow.js
- ✊ Rock
- 🖐️ Paper
- ✌️ Scissors
- 🤖 Random AI opponent
- 🏆 Player vs Robot score
- 🔄 Reset score
- ⚡ Battle animation
- 🎨 Robot + graffiti visual style
- 📱 Responsive untuk desktop dan mobile
- 🌐 Bisa di-deploy menggunakan GitHub Pages

---

🛠️ Technologies

Project ini dibuat menggunakan:

- HTML5
- CSS3
- JavaScript
- TensorFlow.js
- Teachable Machine
- Webcam API
- GitHub Pages

---

📁 Project Structure

RPS-Robot-Battle/
│
├── index.html
├── style.css
├── app.js
└── README.md

---

🧠 Teachable Machine Model

Game ini tidak menggunakan model yang ditanam langsung di source code.

URL model dimasukkan melalui input yang tersedia di dalam game.

Contoh format URL:

https://teachablemachine.withgoogle.com/models/XXXXXXXXX/

Setelah URL dimasukkan, tekan:

CONNECT

Game akan mengambil:

model.json
metadata.json

dari URL tersebut.

Class Model

Model Teachable Machine sebaiknya memiliki 3 class yang mengandung nama:

Rock / Batu
Paper / Kertas
Scissors / Gunting

Contoh:

Batu
Kertas
Gunting

Game akan membaca nama class tersebut secara otomatis.

---

🚀 How To Run

1. Download / Clone Repository

git clone https://github.com/USERNAME/RPS-Robot-Battle.git

Masuk ke folder:

cd RPS-Robot-Battle

2. Jalankan Website

Project ini tidak membutuhkan backend.

Cukup buka:

index.html

di browser.

Untuk hasil yang lebih baik, gunakan browser seperti:

- Google Chrome
- Microsoft Edge
- Firefox

«Kamera mungkin meminta izin akses ketika game mulai menggunakan webcam.»

---

🎮 How To Play

Step 1

Masukkan URL model Teachable Machine pada bagian:

NEURAL MODEL CONNECTION

Step 2

Tekan:

CONNECT

Tunggu sampai status berubah menjadi:

● NEURAL MODEL ONLINE

Step 3

Izinkan browser menggunakan kamera.

Step 4

Tekan:

START

Step 5

Tunjukkan gesture tangan ke kamera.

Game akan mendeteksi gesture dan menentukan:

✊ ROCK
🖐️ PAPER
✌️ SCISSORS

Step 6

Robot akan memilih gerakan secara otomatis.

Kemudian sistem menentukan hasil pertandingan.

---

🏆 Game Rules

Aturan permainan mengikuti aturan Batu, Gunting, Kertas:

ROCK
  ↓ beats
SCISSORS

SCISSORS
  ↓ beats
PAPER

PAPER
  ↓ beats
ROCK

Jika kedua pemain memilih gerakan yang sama:

DRAW

---

🌐 Deploy To GitHub Pages

Project ini dapat dijalankan menggunakan GitHub Pages.

1. Buat Repository

Buat repository baru di GitHub.

Contoh nama:

RPS-Robot-Battle

2. Upload Files

Upload:

index.html
style.css
app.js
README.md

3. Aktifkan GitHub Pages

Masuk ke:

Settings
→ Pages

Pada bagian Build and deployment, pilih:

Source: Deploy from a branch

Kemudian pilih:

Branch: main
Folder: / (root)

Tekan:

Save

Tunggu proses deployment selesai.

Website kemudian dapat diakses melalui halaman GitHub Pages repository tersebut.

---

📱 Browser Compatibility

Game membutuhkan:

- Browser modern
- JavaScript aktif
- Webcam
- Internet connection untuk library TensorFlow.js dan Teachable Machine

Pastikan browser memiliki izin untuk menggunakan kamera.

---

🎨 Design

Visual game menggunakan konsep:

Robot Battle × Street Graffiti

Dengan elemen:

- 🤖 Robot interface
- ⚡ Futuristic HUD
- 🎨 Graffiti typography
- 🧱 Dark street background
- 🔴 Battle indicators
- 🟡 Arcade-style elements
- 🔵 Neon-style interface

---

📌 Notes

Model Teachable Machine harus dapat diakses secara publik agar browser dapat mengambil "model.json" dan "metadata.json".

Project ini menggunakan URL model yang dimasukkan oleh pengguna sehingga model dapat diganti tanpa mengubah source code.

---

👨‍💻 Author

Created by Oceload

RPS ROBOT BATTLE

«MAKE YOUR MOVE. LET THE MACHINE DECIDE. 🤖⚡»

---

📄 License

This project is created for educational and personal project purposes.
