/* ====== Dashboard ======
   Halaman pertama yang tampil. Berisi ringkasan, daftar materi, soal hari ini, dan aktivitas terakhir.
   Data materi diambil otomatis dari SOLVERS (rumus.js) dan SOAL (soal.js). */

/* Riwayat perhitungan disimpan di browser pengguna (localStorage), tidak dikirim ke mana pun. */
const Riwayat = (() => {
  const K = 'probstat.riwayat', T = 'probstat.total';
  const baca = () => { try { return JSON.parse(localStorage.getItem(K)) || []; } catch (e) { return []; } };
  const total = () => { try { return +localStorage.getItem(T) || 0; } catch (e) { return 0; } };
  return {
    baca, total,
    catat(id, ringkas, values) {
      try {
        const sama = r => r.id === id && JSON.stringify(r.values) === JSON.stringify(values);
        const a = baca().filter(r => !sama(r));
        a.unshift({ id, ringkas, values, waktu: Date.now() });
        localStorage.setItem(K, JSON.stringify(a.slice(0, 5)));
        localStorage.setItem(T, total() + 1);
      } catch (e) { /* penyimpanan dimatikan browser: abaikan */ }
    },
    hapus() { try { localStorage.removeItem(K); } catch (e) { } }
  };
})();

const Dashboard = (() => {
  const $ = id => document.getElementById(id);
  const lalu = t => {
    const d = (Date.now() - t) / 1000;
    if (d < 60) return 'baru saja';
    if (d < 3600) return Math.floor(d / 60) + ' menit lalu';
    if (d < 86400) return Math.floor(d / 3600) + ' jam lalu';
    return Math.floor(d / 86400) + ' hari lalu';
  };
  const sapa = () => { const j = new Date().getHours(); return j < 11 ? 'pagi' : j < 15 ? 'siang' : j < 18 ? 'sore' : 'malam'; };
  const judul = id => (SOLVERS.find(s => s.id === id) || {}).t || id;

  function render() {
    const grup = [...new Set(SOLVERS.map(s => s.g))];
    const riwayat = Riwayat.baca();

    $('dSapa').textContent = `Selamat ${sapa()}, ayo belajar probstat.`;
    $('dMulai').setAttribute('href', '#' + (riwayat[0] ? riwayat[0].id : SOLVERS[0].id));
    if (!$('dKurva').firstChild) {                       // pakai ulang gambar kurva dari hero kalkulator
      const k = document.querySelector('#viewK .hero-kurva');
      if (k) $('dKurva').appendChild(k.cloneNode(true));
    }

    /* Ringkasan */
    const stat = [
      [SOLVERS.length, 'Kalkulator'], [SOAL.length, 'Contoh soal'],
      [grup.length, 'Bab materi'], [Riwayat.total(), 'Perhitungan Anda']
    ];
    $('dStat').innerHTML = stat.map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join('');

    /* Materi per bab */
    $('dMateri').innerHTML = grup.map((g, i) => {
      const alat = SOLVERS.filter(s => s.g === g), jmlSoal = SOAL.filter(s => s.bab === g).length;
      return `<article class="bab">
        <span class="tag b${i % 5}">${esc(g)}</span>
        <p class="bab-info">${alat.length} kalkulator · ${jmlSoal} contoh soal</p>
        <ul>${alat.map(s => `<li><a href="#${s.id}">${esc(s.t)}</a></li>`).join('')}</ul>
      </article>`;
    }).join('');

    /* Soal hari ini (berganti tiap hari) */
    const n = new Date(), hari = Math.floor((n - new Date(n.getFullYear(), 0, 0)) / 864e5);
    const idx = hari % SOAL.length, q = SOAL[idx], bi = Math.max(0, grup.indexOf(q.bab));
    $('dHariIni').innerHTML = `<div class="hari-ini">
      <span class="tag b${bi % 5}">${esc(q.bab)}</span>
      <p class="teks">${esc(q.soal)}</p>
      <details>
        <summary>Lihat pembahasan</summary>
        <ol class="langkah">${q.langkah.map(t => `<li><h3>${esc(t.h)}</h3>${t.l.map(x => `<p>${esc(x)}</p>`).join('')}</li>`).join('')}</ol>
        <div class="jawaban"><h3>Jawaban</h3><dl><dd>${esc(q.jawab)}</dd></dl></div>
      </details>
      <a class="lihat-semua" href="#soal">Lihat semua contoh soal →</a>
    </div>`;

    /* Aktivitas terakhir */
    $('dRiwayat').innerHTML = riwayat.length
      ? `<ul class="riwayat">${riwayat.map((r, i) => `<li><a href="#${r.id}" data-r="${i}"><b>${esc(judul(r.id))}</b><span>${esc(r.ringkas)}</span><small>${lalu(r.waktu)}</small></a></li>`).join('')}</ul>
         <button type="button" class="hapus" id="dHapus">Hapus riwayat</button>`
      : `<p class="kosong-kecil">Belum ada perhitungan. Pilih salah satu materi untuk mulai.</p>`;
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('#dRiwayat a[data-r]');
    if (a) { const r = Riwayat.baca()[+a.dataset.r]; if (r) window.PREISI = { id: r.id, values: r.values }; }  // buka kalkulator dengan angka terisi
    if (e.target.id === 'dHapus') { Riwayat.hapus(); render(); }
  });

  return { render };
})();