/* ====== Navbar ======
   Pasang dengan: <div id="navbar"></div> dan <script src="navbar.js"></script>.
   Menu baru: tambahkan satu objek di MENU. 'hash' adalah alamat tujuan (#...). */
(function () {
  const IKON = {
    logo: '<path d="M2 19c3.5 0 4.5-14 10-14s6.5 14 10 14"/>',
    kalkulator: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01"/>',
    soal: '<path d="M9 3h6l1 2h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3z"/><path d="M8 12h8M8 16h5"/>'
  };
  const MENU = [
    { v: 'kalkulator', t: 'Kalkulator', ikon: 'kalkulator', hash: 'desk' },   // hash = jenis soal terakhir yang dibuka
    { v: 'soal', t: 'Contoh soal', ikon: 'soal', hash: 'soal' }
  ];
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${IKON[k]}</svg>`;

  const host = document.getElementById('navbar');
  if (!host) return;
  host.innerHTML = `
    <header class="nb" id="nb">
      <div class="nb-dalam">
        <a class="nb-merek" href="#" data-v="kalkulator" aria-label="Probstat, ke kalkulator">
          <span class="nb-logo">${svg('logo')}</span>
          <span class="nb-nama"><b>Probstat</b><small>Kalkulator dan contoh soal</small></span>
        </a>
        <nav class="nb-menu" aria-label="Menu utama">
          ${MENU.map(m => `<a href="#${m.hash}" data-v="${m.v}">${svg(m.ikon)}${m.t}</a>`).join('')}
        </nav>
      </div>
    </header>`;

  const bar = document.getElementById('nb'), link = bar.querySelectorAll('a[data-v]');

  function sinkron() {
    const h = location.hash.slice(1), aktif = h === 'soal' ? 'soal' : 'kalkulator';
    if (h && h !== 'soal') MENU[0].hash = h;                      // ingat jenis soal terakhir
    link.forEach(a => {
      if (a.dataset.v === 'kalkulator') a.setAttribute('href', '#' + MENU[0].hash);
      if (a.closest('.nb-menu')) a.setAttribute('aria-current', a.dataset.v === aktif ? 'page' : 'false');
    });
  }
  const bayang = () => bar.classList.toggle('bayang', window.scrollY > 4);

  window.addEventListener('hashchange', sinkron);
  window.addEventListener('scroll', bayang, { passive: true });
  sinkron(); bayang();
})();