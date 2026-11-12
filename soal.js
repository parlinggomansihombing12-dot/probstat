/* ====== Bank Contoh Soal ======
   Tambah soal baru: salin satu blok di array SOAL, lalu ubah isinya.
   bab   : nama bab (otomatis jadi tombol filter)
   soal  : teks soal
   langkah: daftar langkah, tiap langkah = { h: judul, l: [baris rumus/hitungan] }
   jawab : jawaban akhir
   alat  : (opsional) id kalkulator di index.html, supaya ada tautan "Cek di kalkulator" */
const SOAL = [
{
  bab: 'Statistika deskriptif', alat: 'desk',
  soal: 'Nilai 7 mahasiswa pada kuis Probstat adalah 62, 70, 75, 75, 80, 88, 90. Tentukan rata-rata, median, modus, dan simpangan baku sampel.',
  langkah: [
    { h: 'Rata-rata', l: ['x̄ = Σx / n = (62 + 70 + 75 + 75 + 80 + 88 + 90) / 7', 'x̄ = 540 / 7 = 77,143'] },
    { h: 'Median', l: ['n = 7 (ganjil), maka median adalah data ke-4 setelah diurutkan.', 'Me = 75'] },
    { h: 'Modus', l: ['Nilai yang paling sering muncul adalah 75 (2 kali).'] },
    { h: 'Simpangan baku', l: ['Σ(x − x̄)² = 580,857', 's² = 580,857 / (7 − 1) = 96,810', 's = √96,810 = 9,839'] }
  ],
  jawab: 'x̄ ≈ 77,14;  Me = 75;  Modus = 75;  s ≈ 9,84'
},
{
  bab: 'Statistika deskriptif', alat: 'desk',
  soal: 'Hitung varians dan simpangan baku sampel dari data 4, 6, 8, 10, 12.',
  langkah: [
    { h: 'Rata-rata', l: ['x̄ = (4 + 6 + 8 + 10 + 12) / 5 = 8'] },
    { h: 'Jumlah kuadrat selisih', l: ['Σ(x − x̄)² = (−4)² + (−2)² + 0² + 2² + 4² = 16 + 4 + 0 + 4 + 16 = 40'] },
    { h: 'Varians dan simpangan baku', l: ['s² = 40 / (5 − 1) = 10', 's = √10 = 3,162'] }
  ],
  jawab: 's² = 10;  s ≈ 3,162'
},
{
  bab: 'Peluang', alat: 'komb',
  soal: 'Dari 10 mahasiswa, (a) berapa cara memilih 3 orang sebagai panitia tanpa jabatan, dan (b) berapa cara memilih ketua, sekretaris, dan bendahara?',
  langkah: [
    { h: '(a) Urutan tidak penting → kombinasi', l: ['C(10, 3) = 10! / (3! · 7!) = (10 · 9 · 8) / (3 · 2 · 1) = 120'] },
    { h: '(b) Urutan penting (jabatan berbeda) → permutasi', l: ['P(10, 3) = 10! / 7! = 10 · 9 · 8 = 720'] }
  ],
  jawab: '(a) 120 cara;  (b) 720 cara'
},
{
  bab: 'Peluang',
  soal: 'Berapa banyak susunan huruf berbeda yang dapat dibentuk dari kata STATISTIKA?',
  langkah: [
    { h: 'Hitung banyak huruf', l: ['S = 2, T = 3, A = 2, I = 2, K = 1  →  total n = 10'] },
    { h: 'Permutasi dengan unsur sama', l: ['n! / (n1! · n2! · …) = 10! / (2! · 3! · 2! · 2! · 1!)', '= 3.628.800 / 48 = 75.600'] }
  ],
  jawab: '75.600 susunan'
},
{
  bab: 'Peluang', alat: 'gab',
  soal: 'Satu kartu diambil acak dari 52 kartu remi. Berapa peluang terambil kartu As atau kartu Hati?',
  langkah: [
    { h: 'Tentukan peluang tiap kejadian', l: ['P(As) = 4/52,  P(Hati) = 13/52,  P(As ∩ Hati) = 1/52 (As Hati)'] },
    { h: 'Rumus gabungan', l: ['P(A ∪ B) = P(A) + P(B) − P(A ∩ B)', '= 4/52 + 13/52 − 1/52 = 16/52 = 4/13 ≈ 0,3077'] }
  ],
  jawab: '4/13 ≈ 0,3077'
},
{
  bab: 'Peluang', alat: 'bayes',
  soal: 'Mesin A menghasilkan 60% produk pabrik dengan 2% cacat. Mesin B menghasilkan 40% sisanya dengan 5% cacat. Jika sebuah produk yang diambil acak ternyata cacat, berapa peluang produk itu berasal dari mesin A?',
  langkah: [
    { h: 'Tulis yang diketahui', l: ['P(A) = 0,6;  P(B) = 0,4', 'P(cacat | A) = 0,02;  P(cacat | B) = 0,05'] },
    { h: 'Peluang total cacat', l: ['P(cacat) = 0,02 · 0,6 + 0,05 · 0,4 = 0,012 + 0,020 = 0,032'] },
    { h: 'Teorema Bayes', l: ['P(A | cacat) = P(cacat | A) P(A) / P(cacat)', '= 0,012 / 0,032 = 0,375'] }
  ],
  jawab: '0,375 (37,5%)'
},
{
  bab: 'Distribusi', alat: 'binom',
  soal: 'Sebuah kuis berisi 10 soal pilihan ganda dengan 4 opsi. Seorang mahasiswa menebak semua jawaban. Berapa peluang ia menjawab benar tepat 3 soal? Berapa peluang ia benar minimal 1 soal?',
  langkah: [
    { h: 'Tentukan parameter', l: ['Binomial dengan n = 10, p = 1/4 = 0,25'] },
    { h: 'Peluang tepat 3 benar', l: ['P(X = 3) = C(10, 3) · 0,25³ · 0,75⁷', '= 120 · 0,015625 · 0,13348 = 0,2503'] },
    { h: 'Peluang minimal 1 benar', l: ['P(X ≥ 1) = 1 − P(X = 0) = 1 − 0,75¹⁰', '= 1 − 0,0563 = 0,9437'] }
  ],
  jawab: 'P(X = 3) ≈ 0,2503;  P(X ≥ 1) ≈ 0,9437'
},
{
  bab: 'Distribusi', alat: 'poisson',
  soal: 'Rata-rata ada 4 pelanggan datang ke kasir setiap jam. Berapa peluang tepat 2 pelanggan datang dalam satu jam? Berapa peluang paling banyak 2 pelanggan?',
  langkah: [
    { h: 'Tentukan parameter', l: ['Poisson dengan λ = 4'] },
    { h: 'Tepat 2 pelanggan', l: ['P(X = 2) = e⁻⁴ · 4² / 2! = 8 · e⁻⁴ = 0,1465'] },
    { h: 'Paling banyak 2 pelanggan', l: ['P(X ≤ 2) = e⁻⁴ (1 + 4 + 8) = 13 · e⁻⁴ = 0,2381'] }
  ],
  jawab: 'P(X = 2) ≈ 0,1465;  P(X ≤ 2) ≈ 0,2381'
},
{
  bab: 'Distribusi', alat: 'normal',
  soal: 'Nilai ujian berdistribusi normal dengan μ = 70 dan σ = 10. Tentukan (a) peluang nilai lebih dari 85, dan (b) peluang nilai antara 60 dan 80.',
  langkah: [
    { h: '(a) Ubah ke skor Z', l: ['Z = (85 − 70) / 10 = 1,5', 'P(X > 85) = P(Z > 1,5) = 1 − Φ(1,5) = 1 − 0,9332 = 0,0668'] },
    { h: '(b) Ubah kedua batas', l: ['Z1 = (60 − 70) / 10 = −1', 'Z2 = (80 − 70) / 10 = 1'] },
    { h: '(b) Hitung luas', l: ['P(−1 < Z < 1) = Φ(1) − Φ(−1) = 0,8413 − 0,1587 = 0,6827'] }
  ],
  jawab: '(a) 0,0668 (6,68%);  (b) 0,6827 (68,27%)'
},
{
  bab: 'Distribusi',
  soal: 'Pada soal nilai ujian di atas (μ = 70, σ = 10), berapa nilai minimum agar seorang mahasiswa masuk 10% nilai tertinggi?',
  langkah: [
    { h: 'Cari Z untuk luas kanan 10%', l: ['Luas kiri = 0,90  →  Z ≈ 1,2816 (dari tabel normal)'] },
    { h: 'Ubah kembali ke X', l: ['X = μ + Z · σ = 70 + 1,2816 · 10 = 82,82'] }
  ],
  jawab: 'Nilai minimum ≈ 82,82'
},
{
  bab: 'Inferensi', alat: 'ci',
  soal: 'Sampel 36 mahasiswa memiliki rata-rata skor 50 dengan σ = 8. Buat interval kepercayaan 95% untuk rata-rata populasi.',
  langkah: [
    { h: 'Galat baku', l: ['SE = σ / √n = 8 / 6 = 1,3333'] },
    { h: 'Nilai kritis', l: ['Tingkat 95% → α/2 = 0,025 → z = 1,96'] },
    { h: 'Batas galat dan interval', l: ['E = 1,96 · 1,3333 = 2,6133', '50 − 2,6133 < μ < 50 + 2,6133', '47,39 < μ < 52,61'] }
  ],
  jawab: '47,39 < μ < 52,61'
},
{
  bab: 'Inferensi', alat: 'ci',
  soal: 'Sampel 16 baterai memiliki rata-rata umur 25 jam dengan simpangan baku sampel s = 4. Buat interval kepercayaan 95% untuk rata-rata umur baterai (σ tidak diketahui).',
  langkah: [
    { h: 'Pilih distribusi t', l: ['σ tidak diketahui dan n kecil → gunakan t dengan db = n − 1 = 15'] },
    { h: 'Nilai kritis', l: ['t(0,025; 15) = 2,1314'] },
    { h: 'Batas galat dan interval', l: ['SE = 4 / √16 = 1', 'E = 2,1314 · 1 = 2,1314', '22,87 < μ < 27,13'] }
  ],
  jawab: '22,87 < μ < 27,13'
},
{
  bab: 'Inferensi', alat: 'uji',
  soal: 'Pabrik mengklaim rata-rata umur baterainya 100 jam. Sampel 25 baterai menghasilkan x̄ = 104 jam dan s = 10. Dengan α = 0,05, apakah klaim itu dapat ditolak? (uji dua arah)',
  langkah: [
    { h: 'Hipotesis', l: ['H0: μ = 100', 'H1: μ ≠ 100'] },
    { h: 'Statistik uji (t, karena memakai s)', l: ['t = (x̄ − μ0) / (s / √n) = (104 − 100) / (10 / 5) = 2', 'db = 25 − 1 = 24'] },
    { h: 'Daerah kritis', l: ['t(0,025; 24) = 2,0639  →  tolak H0 jika |t| > 2,0639', 'Nilai p ≈ 0,0569'] },
    { h: 'Keputusan', l: ['|t| = 2 < 2,0639 (p > α), sehingga gagal tolak H0.'] }
  ],
  jawab: 'Gagal tolak H0: belum cukup bukti bahwa rata-rata umur baterai berbeda dari 100 jam.'
},
{
  bab: 'Inferensi', alat: 'uji',
  soal: 'Rata-rata waktu tunggu suatu layanan diklaim 50 menit. Sampel 36 pelanggan memberi x̄ = 52 menit, dan σ = 6 diketahui. Dengan α = 0,05, ujilah apakah waktu tunggu sebenarnya lebih lama dari 50 menit.',
  langkah: [
    { h: 'Hipotesis', l: ['H0: μ = 50', 'H1: μ > 50 (uji satu arah kanan)'] },
    { h: 'Statistik uji (z, karena σ diketahui)', l: ['z = (52 − 50) / (6 / √36) = 2 / 1 = 2'] },
    { h: 'Daerah kritis', l: ['α = 0,05 → z kritis = 1,645  →  tolak H0 jika z > 1,645', 'Nilai p = 1 − Φ(2) = 0,0228'] },
    { h: 'Keputusan', l: ['z = 2 > 1,645 (p < α), sehingga tolak H0.'] }
  ],
  jawab: 'Tolak H0: ada bukti bahwa waktu tunggu rata-rata lebih dari 50 menit.'
},
{
  bab: 'Regresi', alat: 'reg',
  soal: 'Data jam belajar (X) dan nilai (Y) lima mahasiswa: X = 1, 2, 3, 4, 5 dan Y = 2, 4, 5, 4, 6. Tentukan persamaan regresi linear, koefisien korelasi, dan prediksi nilai untuk X = 6.',
  langkah: [
    { h: 'Hitung jumlah', l: ['n = 5;  Σx = 15;  Σy = 21;  Σxy = 66;  Σx² = 55;  Σy² = 97'] },
    { h: 'Kemiringan b', l: ['b = (nΣxy − ΣxΣy) / (nΣx² − (Σx)²) = (5·66 − 15·21) / (5·55 − 15²) = 15 / 50 = 0,8'] },
    { h: 'Intersep a', l: ['a = ȳ − b·x̄ = 4,2 − 0,8 · 3 = 1,8', 'Persamaan: Y = 1,8 + 0,8X'] },
    { h: 'Korelasi', l: ['r = 15 / √(50 · 20) = 15 / 31,623 = 0,8528', 'r² = 0,7273 (72,73% variasi Y dijelaskan oleh X)'] },
    { h: 'Prediksi', l: ['X = 6  →  Y = 1,8 + 0,8 · 6 = 6,6'] }
  ],
  jawab: 'Y = 1,8 + 0,8X;  r ≈ 0,8528;  prediksi Y(6) = 6,6'
}
];

const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
if (typeof document !== 'undefined') {
  const daftar = document.getElementById('daftar'), cari = document.getElementById('cari'), filter = document.getElementById('filter');
  const bab = ['Semua', ...new Set(SOAL.map(s => s.bab))];
  let aktif = 'Semua';

  filter.innerHTML = bab.map(b => `<button aria-pressed="${b === aktif}">${esc(b)}</button>`).join('');
  filter.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    aktif = b.textContent;
    filter.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    gambar();
  };
  cari.oninput = gambar;

  function gambar() {
    const q = cari.value.trim().toLowerCase();
    const hasil = SOAL.map((s, i) => ({ s, i })).filter(({ s }) => (aktif === 'Semua' || s.bab === aktif) && (!q || (s.soal + s.bab).toLowerCase().includes(q)));
    daftar.innerHTML = hasil.length ? hasil.map(({ s, i }, n) => `
      <details class="soal">
        <summary><span class="nomor"></span><span><span class="tag b${(bab.indexOf(s.bab) - 1) % 5}">${esc(s.bab)}</span><p class="teks">${esc(s.soal)}</p></span></summary>
        <div class="solusi">
          <ol class="langkah">${s.langkah.map(t => `<li><h3>${esc(t.h)}</h3>${t.l.map(x => `<p>${esc(x)}</p>`).join('')}</li>`).join('')}</ol>
          <div class="jawaban"><h3>Jawaban</h3><dl><dd>${esc(s.jawab)}</dd></dl></div>
          ${s.alat ? `<a class="coba" href="#${s.alat}">Cek di kalkulator</a>` : ''}
        </div>
      </details>`).join('') : '<p class="kosong">Tidak ada soal yang cocok. Coba kata kunci lain atau pilih Semua.</p>';
  }
  gambar();
}