/* ====== Navbar ======
   Pasang dengan: <div id="navbar"></div> dan <script src="navbar.js"></script>.
   Menu baru: tambahkan satu objek di MENU. 'hash' adalah alamat tujuan (#...). */
(function () {
  const IKON = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    logo: '<path d="M2 19c3.5 0 4.5-14 10-14s6.5 14 10 14"/>',
    kalkulator: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01"/>',
    soal: '<path d="M9 3h6l1 2h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3z"/><path d="M8 12h8M8 16h5"/>',
    tanya: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>'
  };
  
  const MENU = [
    { v: 'dashboard', t: 'Dashboard', ikon: 'dashboard', hash: 'dashboard' },
    { v: 'kalkulator', t: 'Kalkulator', ikon: 'kalkulator', hash: 'desk' },
    { v: 'soal', t: 'Contoh soal', ikon: 'soal', hash: 'soal' },
    { v: 'tanya', t: 'Tanya soal', ikon: 'tanya', hash: 'tanya' }
  ];
  
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IKON[k]}</svg>`;

  const host = document.getElementById('navbar');
  if (!host) return;
  host.innerHTML = `
    <header class="nb" id="nb">
      <div class="nb-dalam">
        <a class="nb-merek" href="#dashboard" aria-label="Probstat, ke dashboard">
          <span class="nb-logo">${svg('logo')}</span>
          <span class="nb-nama"><b>Probstat</b><small>Kalkulator dan contoh soal</small></span>
        </a>
        <nav class="nb-menu" aria-label="Menu utama">
          ${MENU.map(m => `<a href="#${m.hash}" data-v="${m.v}">${svg(m.ikon)}${m.t}</a>`).join('')}
        </nav>
      </div>
    </header>`;

  const bar = document.getElementById('nb'), link = bar.querySelectorAll('.nb-menu a');

  let terakhir = 'desk';                                          // jenis soal kalkulator yang terakhir dibuka
  function sinkron() {
    const h = location.hash.slice(1);
    const aktif = h === 'soal' ? 'soal' : h === 'tanya' ? 'tanya' : (h === '' || h === 'dashboard') ? 'dashboard' : 'kalkulator';
    if (aktif === 'kalkulator') terakhir = h;                       // ingat solver terakhir
    link.forEach(a => {
      if (a.dataset.v === 'kalkulator') a.setAttribute('href', '#' + terakhir);
      const sekarang = a.dataset.v === aktif;
      a.setAttribute('aria-current', sekarang ? 'page' : 'false');
      if (sekarang && a.scrollIntoView) a.scrollIntoView({ inline: 'center', block: 'nearest' });   // menu bisa digeser di HP
    });
  }
  const bayang = () => bar.classList.toggle('bayang', window.scrollY > 4);

  window.addEventListener('hashchange', sinkron);
  window.addEventListener('scroll', bayang, { passive: true });
  sinkron(); bayang();
})();