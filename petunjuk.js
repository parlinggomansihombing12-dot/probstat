/* ====== Petunjuk Penggunaan & Pelengkap Desain Probstat ====== */
(function () {
  const PANDUAN_BAB = [
    {
      bab: 'Statistika deskriptif',
      alat: [
        {
          id: 'desk',
          nama: 'Pemusatan & penyebaran data',
          ket: 'Gunakan untuk data mentah tunggal. Menghasilkan rata-rata, median, modus, jangkauan (R), Q1, Q3, IQR, serta varians dan simpangan baku (sampel & populasi).'
        }
      ]
    },
    {
      bab: 'Peluang',
      alat: [
        {
          id: 'komb',
          nama: 'Permutasi & kombinasi',
          ket: 'Pilih Permutasi (nPr) jika urutan diperhatikan (misal: jabatan ketua-sekretaris). Pilih Kombinasi (nCr) jika urutan tidak diperhatikan (misal: tim panitia).'
        },
        {
          id: 'gab',
          nama: 'Peluang kejadian A dan B',
          ket: 'Masukkan P(A), P(B), dan irisan P(A ∩ B) bernilai 0 sampai 1 untuk mencari peluang gabungan P(A ∪ B), peluang bersyarat, dan cek saling bebas.'
        },
        {
          id: 'bayes',
          nama: 'Teorema Bayes',
          ket: 'Digunakan untuk menghitung peluang penyebab A setelah suatu hasil/gejala B diketahui terjadi.'
        }
      ]
    },
    {
      bab: 'Distribusi',
      alat: [
        {
          id: 'binom',
          nama: 'Distribusi binomial',
          ket: 'Gunakan jika terdapat n percobaan saling bebas dengan peluang sukses p yang tetap pada setiap percobaan.'
        },
        {
          id: 'poisson',
          nama: 'Distribusi Poisson',
          ket: 'Gunakan untuk menghitung peluang banyaknya kejadian dalam selang waktu atau ruang tertentu jika diketahui rata-rata kejadian (λ).'
        },
        {
          id: 'normal',
          nama: 'Distribusi normal',
          ket: 'Mengubah nilai X menjadi skor baku Z menggunakan rata-rata (μ) dan simpangan baku (σ), lalu menghitung luas kurva kiri, kanan, atau di antara dua batas.'
        }
      ]
    },
    {
      bab: 'Regresi',
      alat: [
        {
          id: 'reg',
          nama: 'Regresi & korelasi linear',
          ket: 'Masukkan pasangan data X dan Y dengan jumlah yang sama untuk memperoleh persamaan Y = a + bX, koefisien korelasi (r), r², dan prediksi nilai Y.'
        }
      ]
    }
  ];

  // 1. Tambahkan tombol Petunjuk Penggunaan di bagian Hero
  const heroTeks = document.querySelector('#viewK .hero-teks');
  if (heroTeks) {
    heroTeks.insertAdjacentHTML('beforeend', `
      <div class="hero-aksi">
        <a class="btn-panduan" href="#panduan-kalkulator">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Petunjuk Penggunaan
        </a>
        <button type="button" class="btn-panduan btn-panduan-sekunder" id="btnModalPanduan">
          Ringkasan Format Input
        </button>
      </div>
    `);
  }

  // 2. Tambahkan Section Petunjuk Penggunaan di bawah area kalkulator
  const viewK = document.getElementById('viewK');
  if (viewK) {
    viewK.insertAdjacentHTML('beforeend', `
      <section class="wadah panduan-wrap" id="panduan-kalkulator" aria-label="Petunjuk penggunaan kalkulator">
        <div class="panduan-kartu">
          <div class="panduan-kepala">
            <div>
              <span class="panduan-tag">Panduan Pengguna</span>
              <h2>Petunjuk Penggunaan Kalkulator Probstat</h2>
              <p>Ikuti empat langkah berikut untuk menghitung soal probabilitas dan statistika lengkap dengan rumus dan tahapan substitusinya.</p>
            </div>
          </div>

          <div class="panduan-grid">
            <article class="langkah-kartu">
              <span class="langkah-no">1</span>
              <h3>Pilih Jenis Kalkulator</h3>
              <p>Klik salah satu dari 10 topik perhitungan pada panel navigasi di sebelah kiri sesuai bab materi soal Anda.</p>
            </article>
            <article class="langkah-kartu">
              <span class="langkah-no">2</span>
              <h3>Masukkan Parameter Soal</h3>
              <p>Baca keterangan singkat di bawah judul kalkulator, lalu ketikkan nilai yang diketahui pada setiap kolom input.</p>
            </article>
            <article class="langkah-kartu">
              <span class="langkah-no">3</span>
              <h3>Gunakan Tombol Aksi</h3>
              <p>Tekan <b>Hitung</b> untuk memproses hasil, <b>Isi contoh</b> untuk simulasi data otomatis, atau <b>Kosongkan</b> untuk mereset formulir.</p>
            </article>
            <article class="langkah-kartu">
              <span class="langkah-no">4</span>
              <h3>Pelajari Langkah & Hasil</h3>
              <p>Lihat nilai akhir pada kotak gelap <b>Jawaban</b>, lalu ikuti linimasa <b>Langkah-langkah</b> di bawahnya untuk memahami prosesnya.</p>
            </article>
          </div>

          <div class="aturan-box">
            <h3>Aturan Penulisan Angka & Validasi Input</h3>
            <ul class="aturan-list">
              <li><b>Tanda Desimal:</b> Pada kolom angka tunggal dapat menggunakan titik (<code>.</code>) atau koma (<code>,</code>). Khusus pada kolom deret data mentah, gunakan titik (<code>.</code>) untuk desimal.</li>
              <li><b>Pemisah Deret Data:</b> Pada menu <i>Statistika deskriptif</i> dan <i>Regresi linear</i>, pisahkan setiap angka dengan spasi, koma, titik koma, atau baris baru (<i>Enter</i>).</li>
              <li><b>Batas Nilai Peluang:</b> Nilai peluang seperti <code>P(A)</code>, <code>P(B)</code>, dan <code>p</code> harus berada di antara <code>0</code> hingga <code>1</code>, dengan <code>P(A ∩ B)</code> tidak melebihi <code>P(A)</code> maupun <code>P(B)</code>.</li>
              <li><b>Integrasi Contoh Soal:</b> Pada menu <b>Contoh soal</b> di bilah atas, buka pembahasan soal lalu klik <b>Cek di kalkulator</b> untuk langsung menguji soal tersebut di kalkulator terkait.</li>
            </ul>
          </div>

          <div class="bab-panduan">
            <h3>Panduan Memilih Kalkulator Berdasarkan Bab</h3>
            <div class="bab-tabs" id="tabPanduanBab" role="tablist"></div>
            <div class="bab-detail" id="isiPanduanBab" role="tabpanel"></div>
          </div>
        </div>
      </section>
    `);

    const tabWrap = document.getElementById('tabPanduanBab');
    const isiWrap = document.getElementById('isiPanduanBab');
    let aktifBab = 0;

    function renderBab() {
      tabWrap.innerHTML = PANDUAN_BAB.map((item, idx) =>
        `<button type="button" role="tab" aria-selected="${idx === aktifBab}" data-idx="${idx}">${item.bab}</button>`
      ).join('');

      isiWrap.innerHTML = PANDUAN_BAB[aktifBab].alat.map(a => `
        <div class="bab-item">
          <div>
            <b>${a.nama}</b>
            <span>${a.ket}</span>
          </div>
          <a href="#${a.id}">Gunakan kalkulator →</a>
        </div>
      `).join('');
    }

    tabWrap.addEventListener('click', e => {
      const btn = e.target.closest('button[data-idx]');
      if (!btn) return;
      aktifBab = Number(btn.dataset.idx);
      renderBab();
    });

    renderBab();
  }

  // 3. Tambahkan Modal Bantuan Cepat & Footer Halaman
  document.body.insertAdjacentHTML('beforeend', `
    <dialog class="modal-panduan" id="modalPanduan">
      <div class="modal-isi">
        <div class="modal-atas">
          <h3>Ringkasan Cepat Format Input</h3>
          <button type="button" class="modal-tutup" id="tutupModalPanduan" aria-label="Tutup">&times;</button>
        </div>
        <ul class="aturan-list">
          <li><b>Data deret (Statistika & Regresi):</b> Pisahkan dengan spasi atau koma, contoh: <code>60 72 75 80.5 90</code>.</li>
          <li><b>Regresi linear:</b> Pastikan jumlah data pada kolom <code>X</code> dan <code>Y</code> sama (minimal 3 pasang data).</li>
          <li><b>Distribusi normal:</b> Jika memilih <code>P(a &lt; X &lt; b)</code>, pastikan nilai <code>b</code> lebih besar dari <code>a</code>.</li>
          <li><b>Uji hipotesis & Interval kepercayaan:</b> Pilih <code>z</code> jika σ populasi diketahui, atau pilih <code>t</code> jika memakai simpangan baku sampel <code>s</code>.</li>
        </ul>
      </div>
    </dialog>

    <footer class="kaki">
      <div class="wadah kaki-dalam">
        <div><b>Probstat</b> — Kalkulator Probabilitas & Statistika Interaktif</div>
        <div>Dilengkapi rumus, substitusi langkah demi langkah, dan bank contoh soal.</div>
      </div>
    </footer>
  `);

  const modal = document.getElementById('modalPanduan');
  const btnBuka = document.getElementById('btnModalPanduan');
  const btnTutup = document.getElementById('tutupModalPanduan');

  if (modal && btnBuka && btnTutup) {
    btnBuka.addEventListener('click', () => modal.showModal());
    btnTutup.addEventListener('click', () => modal.close());
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.close();
    });
  }
})();