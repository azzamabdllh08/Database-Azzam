SITE VERIFICATION DASHBOARD — GRATIS / GITHUB PAGES

1. File sudah berisi data dari Excel Bos agar dashboard langsung bisa dicoba.
2. Buka index.html untuk preview.
3. Untuk online gratis: buat repository GitHub baru, upload index.html, style.css, app.js, config.js, data.js.
4. GitHub: Settings -> Pages -> Deploy from branch -> main -> /root -> Save.
5. Link akan menjadi https://USERNAME.github.io/NAMA-REPO/

CATATAN ONEDRIVE:
Versi gratis tanpa Microsoft Graph tidak bisa secara aman membaca file .xlsx private OneDrive langsung dari JavaScript browser. Karena itu data.js dibundel agar dashboard langsung jalan.
Config menyediakan onedriveUrl sebagai tombol menuju file sumber.
Jika Bos ingin DATA OTOMATIS berubah saat Excel OneDrive berubah, kita harus memakai Microsoft Graph/API (versi sebelumnya) atau backend/proxy. Jangan membuat file OneDrive menjadi publik hanya untuk mengakali CORS jika datanya internal perusahaan.

Untuk mengubah tampilan: edit style.css.
Untuk mengubah judul/link OneDrive: edit config.js.
