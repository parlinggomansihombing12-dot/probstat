/* ====== Kalkulator Probstat (script.js) ======
   File ini khusus mengatur antarmuka kalkulator dan rute navigasi.
   Rumus & data SOLVERS diambil dari rumus.js.
*/

if (typeof document !== 'undefined') {
  const nav = document.getElementById('nav');
  const panel = document.getElementById('panel');
  const vK = document.getElementById('viewK');
  const vS = document.getElementById('viewS');
  const vT = document.getElementById('viewT');
  const vD = document.getElementById('viewD');

  // 1. Render Menu Sidebar Kalkulator (dari SOLVERS di rumus.js)
  [...new Set(SOLVERS.map(s => s.g))].forEach(gr => {
    nav.insertAdjacentHTML('beforeend', `
      <div>
        <h2>${gr}</h2>
        ${SOLVERS.filter(s => s.g === gr).map(s => `<button data-id="${s.id}">${esc(s.t)}</button>`).join('')}
      </div>
    `);
  });

  nav.onclick = e => {
    const b = e.target.closest('button');
    if (b) pilih(b.dataset.id);
  };

  // 2. Fungsi Membuka Solver Kalkulator
  function pilih(id) {
    const s = SOLVERS.find(v => v.id === id) || SOLVERS[0];
    if (location.hash.slice(1) !== s.id) location.hash = s.id;

    nav.querySelectorAll('button').forEach(b => b.setAttribute('aria-current', b.dataset.id === s.id));

    const kolom = f => {
      const h = f.h ? ` <small>(${esc(f.h)})</small>` : '';
      const isi = f.type === 'sel' 
        ? `<select name="${f.id}">${f.o.map((o, i) => `<option value="${i}">${esc(o)}</option>`).join('')}</select>`
        : f.type === 'area' 
        ? `<textarea name="${f.id}" placeholder="${esc(f.ph || '')}"></textarea>`
        : `<input name="${f.id}" inputmode="decimal" autocomplete="off">`;
      return `<label data-n="${esc(f.l)}" class="${f.type === 'area' ? 'lebar' : ''}">${esc(f.l)}${h}${isi}</label>`;
    };

    panel.innerHTML = `
      <h2>${esc(s.t)}</h2>
      <p class="info">${esc(s.info)}</p>
      <form novalidate>
        ${s.f.map(kolom).join('')}
        <div class="aksi">
          <button class="utama" type="submit">Hitung</button>
          <button type="button" data-a="contoh">Isi contoh</button>
          <button type="button" data-a="reset">Kosongkan</button>
        </div>
      </form>
      <div id="hasil" aria-live="polite"></div>
    `;

    const form = panel.querySelector('form');
    const out = panel.querySelector('#hasil');
    const isi = v => { for (const k in v) if (form.elements[k]) form.elements[k].value = v[k]; };
    let tanpaCatat = false;

    form.onclick = e => {
      const a = e.target.dataset.a;
      if (a === 'contoh') { isi(s.ex); form.requestSubmit(); }
      if (a === 'reset') { form.reset(); out.innerHTML = ''; }
    };

    form.onsubmit = e => {
      e.preventDefault();
      try {
        const r = s.solve(mk(form));
        if (!tanpaCatat) Riwayat.catat(s.id, `${r.ans[0][0]} = ${r.ans[0][1]}`, Object.fromEntries(new FormData(form)));   // simpan ke riwayat dashboard
        tanpaCatat = false;
        out.innerHTML = `
          <div class="jawaban">
            <h3>Jawaban</h3>
            <dl>${r.ans.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
          </div>
          <ol class="langkah">
            ${r.steps.map(t => `<li><h3>${esc(t.h)}</h3>${t.l.map(x => `<p>${esc(x)}</p>`).join('')}</li>`).join('')}
          </ol>
        `;
      } catch (err) {
        out.innerHTML = `<div class="galat" role="alert">${esc(err.message)}</div>`;
      }
    };

    if (window.PREISI && window.PREISI.id === s.id) {          // dibuka dari riwayat dashboard: isi angka lalu hitung
      const v = window.PREISI.values; window.PREISI = null;
      isi(v); tanpaCatat = true; form.requestSubmit();
    }
  }

  // 3. Sistem Rute Navigasi
  //    kosong / #dashboard = Dashboard (halaman pertama), #soal = Contoh Soal, #tanya = Tanya Soal,
  //    selain itu = Kalkulator (#id-jenis-soal)
  function rute() {
    const h = location.hash.slice(1);
    const isDash = (h === '' || h === 'dashboard');
    const isSoal = (h === 'soal');
    const isTanya = (h === 'tanya');
    const isKalkulator = !isDash && !isSoal && !isTanya;

    if (vD) vD.hidden = !isDash;
    if (vK) vK.hidden = !isKalkulator;
    if (vS) vS.hidden = !isSoal;
    if (vT) vT.hidden = !isTanya;

    if (isDash) Dashboard.render();
    if (isKalkulator) pilih(h);
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', rute);

  // Update counter hero jika elemennya ada
  if (document.getElementById('jmlSolver')) document.getElementById('jmlSolver').textContent = SOLVERS.length;
  if (typeof SOAL !== 'undefined') {
    if (document.getElementById('jmlSoal')) document.getElementById('jmlSoal').textContent = SOAL.length;
    if (document.getElementById('jmlBab')) document.getElementById('jmlBab').textContent = new Set(SOAL.map(s => s.bab)).size;
  }

  // Jalankan saat pertama dimuat
  rute();
}