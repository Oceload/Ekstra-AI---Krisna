# HAND CLASH — Batu Gunting Kertas AI

Game batu-gunting-kertas berbasis **Teachable Machine + TensorFlow.js**. Kamera membaca gesture tangan pemain dari model klasifikasi gambar Teachable Machine, kemudian CPU memilih gerakan secara acak.

## 1. Buat model Teachable Machine

Buat **Image Project** dengan minimal 3 kelas:

- `Batu`
- `Gunting`
- `Kertas`

Latih model dengan banyak contoh dari beberapa posisi tangan, jarak, dan pencahayaan.

Setelah selesai, pilih **Export Model → TensorFlow.js → Upload/Host model** dan salin URL model.

Model yang di-load aplikasi mengikuti pola:

```text
MODEL_URL/model.json
MODEL_URL/metadata.json
```

## 2. Jalankan lokal

Karena webcam/browser permission dan `model.json` sebaiknya diakses melalui HTTP(S), gunakan local server. Jangan mengandalkan membuka `index.html` langsung dengan `file://`.

Contoh dengan Python:

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## 3. Jalankan di GitHub Pages

1. Buat repository GitHub baru.
2. Upload `index.html`, `style.css`, `app.js`, dan `README.md`.
3. Masuk ke **Settings → Pages**.
4. Pilih deploy dari branch utama, folder `/root`.
5. Buka URL GitHub Pages kamu.
6. Paste URL model Teachable Machine ke kolom `TEACHABLE MACHINE MODEL URL`.

## 4. Catatan penting

- Browser akan meminta izin kamera.
- Pastikan model benar-benar memiliki 3 kelas yang dapat dikenali sebagai Batu, Gunting, dan Kertas.
- `app.js` sudah mencoba mengenali beberapa variasi nama kelas seperti `rock`, `scissors`, dan `paper`.
- Nilai `minConfidence` dan `stableFrames` di `CONFIG` dapat diubah untuk menyesuaikan sensitivitas model.
- Score disimpan di `localStorage`, jadi biasanya tetap ada saat halaman direfresh pada browser yang sama.

## Struktur

```text
rps-teachable-machine/
├── index.html
├── style.css
├── app.js
└── README.md
```
