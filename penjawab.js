/* ====== PEMBACA SOAL CERITA (penjawab.js) ======
   Menganalisis teks soal cerita, mendeteksi jenis solver yang sesuai,
   mengambil variabel numerik, lalu mengeksekusi solver dari rumus.js.
*/

const PenjawabSoal = {
  // Menormalkan teks (huruf kecil, desimal koma -> titik, bersihkan spasi)
  normalisasi(teks) {
    return teks
      .toLowerCase()
      .replace(/(\d+),(\d+)/g, '$1.$2') // ubah 0,5 jadi 0.5
      .replace(/%/g, ' % ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  // Mengambil seluruh angka dari teks
  ambilAngka(teks) {
    const cocok = teks.match(/-?\d+(?:\.\d+)?/g);
    return cocok ? cocok.map(Number) : [];
  },

  jawab(teksAsli) {
    if (!teksAsli || !teksAsli.trim()) {
      throw new Error('Silakan masukkan soal cerita terlebih dahulu.');
    }

    const t = this.normalisasi(teksAsli);
    const nums = this.ambilAngka(t);

    // --- 1. STATISTIKA DESKRIPTIF (Data tunggal) ---
    if (t.includes('median') || t.includes('modus') || t.includes('kuartil') || 
        (t.includes('data') && nums.length >= 4) || 
        (t.includes('rata-rata') && !t.includes('normal') && nums.length >= 4)) {
      const solver = SOLVERS.find(s => s.id === 'desk');
      if (nums.length < 2) throw new Error('Data angka terlalu sedikit untuk statistika deskriptif (minimal 2 angka).');
      const d = nums.join(' ');
      return { solver, hasil: solver.solve(mkObj(solver, { d })) };
    }

    // --- 2. REGRESI & KORELASI LINEAR ---
    if (t.includes('regresi') || t.includes('korelasi') || (t.includes('variabel x') && t.includes('variabel y'))) {
      const solver = SOLVERS.find(s => s.id === 'reg');
      const mx = t.match(/x\s*[:=]\s*([0-9\s.]+)/);
      const my = t.match(/y\s*[:=]\s*([0-9\s.]+)/);
      let x, y;
      if (mx && my) {
        x = mx[1].trim();
        y = my[1].trim();
      } else if (nums.length >= 4 && nums.length % 2 === 0) {
        const mid = nums.length / 2;
        x = nums.slice(0, mid).join(' ');
        y = nums.slice(mid).join(' ');
      } else {
        throw new Error('Data X dan Y belum jelas. Contoh: X: 1 2 3 4 dan Y: 2 4 5 7');
      }
      return { solver, hasil: solver.solve(mkObj(solver, { x, y, x0: null })) };
    }

    // --- 3. DISTRIBUSI NORMAL ---
    if (t.includes('normal') || t.includes('z-score') || 
       (t.includes('rata-rata') && (t.includes('simpangan baku') || t.includes('standar deviasi')))) {
      const solver = SOLVERS.find(s => s.id === 'normal');

      let mu = null, sd = null;
      const mMu = t.match(/(?:rata[- ]rata|mean|μ)(?:\s*(?:sebesar|=)?\s*)(\d+(?:\.\d+)?)/);
      const mSd = t.match(/(?:simpangan baku|standar deviasi|σ)(?:\s*(?:sebesar|=)?\s*)(\d+(?:\.\d+)?)/);
      if (mMu) mu = Number(mMu[1]);
      if (mSd) sd = Number(mSd[1]);

      if (mu === null || sd === null) {
        if (nums.length >= 3) { mu = nums[0]; sd = nums[1]; }
        else throw new Error('Harap sertakan nilai rata-rata (μ) dan simpangan baku (σ).');
      }

      let j = 0, a = 0, b = null;
      const mAntara = t.match(/antara\s+(\d+(?:\.\d+)?)\s*(?:sampai|dan|-)\s*(\d+(?:\.\d+)?)/);

      if (mAntara) {
        j = 2; // a < X < b
        a = Number(mAntara[1]);
        b = Number(mAntara[2]);
      } else if (t.includes('lebih') || t.includes('di atas') || t.includes('>') || t.includes('melebihi')) {
        j = 1; // X > a
        const mA = t.match(/(?:lebih dari|di atas|>|melebihi)\s*(\d+(?:\.\d+)?)/);
        a = mA ? Number(mA[1]) : nums[nums.length - 1];
      } else {
        j = 0; // X < a
        const mA = t.match(/(?:kurang dari|di bawah|<)\s*(\d+(?:\.\d+)?)/);
        a = mA ? Number(mA[1]) : nums[nums.length - 1];
      }

      return { solver, hasil: solver.solve(mkObj(solver, { mu, sd, j, a, b })) };
    }

    // --- 4. DISTRIBUSI BINOMIAL ---
    if (t.includes('binomial') || (t.includes('peluang') && (t.includes('dilempar') || t.includes('sukses') || t.includes('kali')))) {
      const solver = SOLVERS.find(s => s.id === 'binom');
      let n = null, p = null, x = null;

      // Peluang sukses (p)
      const mPersen = t.match(/(\d+(?:\.\d+)?)\s*%/);
      const mPecahan = t.match(/(\d+)\s*\/\s*(\d+)/);
      if (mPersen) p = Number(mPersen[1]) / 100;
      else if (mPecahan) p = Number(mPecahan[1]) / Number(mPecahan[2]);

      // n (banyak percobaan)
      const mN = t.match(/(?:dilempar|sebanyak|dari|sampel)\s*(\d+)\s*(?:kali|orang|unit|biji)?/);
      if (mN) n = parseInt(mN[1], 10);

      // x (banyak sukses)
      const mX = t.match(/(?:tepat|sukses|muncul|terpilih)\s*(\d+)/);
      if (mX) x = parseInt(mX[1], 10);

      // Fallback deteksi angka jika kalimat bebas
      if (p === null) {
        const des = nums.find(v => v > 0 && v < 1);
        if (des !== undefined) p = des;
      }
      if (n === null && nums.length >= 2) n = Math.max(...nums.filter(v => Number.isInteger(v)));
      if (x === null && nums.length >= 3) x = Math.min(...nums.filter(v => Number.isInteger(v)));

      if (n == null || p == null || x == null) {
        throw new Error('Untuk distribusi binomial, pastikan ada nilai n (jumlah percobaan), p (peluang sukses), dan x (banyak sukses).');
      }

      return { solver, hasil: solver.solve(mkObj(solver, { n, p, x })) };
    }

    // --- 5. PERMUTASI & KOMBINASI ---
    if (t.includes('kombinasi') || t.includes('permutasi') || t.includes('susunan') || t.includes('memilih') || t.includes('cara')) {
      const solver = SOLVERS.find(s => s.id === 'komb');
      if (nums.length < 2) throw new Error('Kombinasi/Permutasi membutuhkan 2 angka: total objek (n) dan yang dipilih (r).');
      const n = Math.max(nums[0], nums[1]);
      const r = Math.min(nums[0], nums[1]);
      return { solver, hasil: solver.solve(mkObj(solver, { n, r })) };
    }

    // --- 6. TEOREMA BAYES ---
    if (t.includes('bayes') || t.includes('positif') || t.includes('sensitivitas') || t.includes('terdiagnosa')) {
      const solver = SOLVERS.find(s => s.id === 'bayes');
      const prob = nums.filter(v => v >= 0 && v <= 1);
      if (prob.length >= 3) {
        return { solver, hasil: solver.solve(mkObj(solver, { a: prob[0], ba: prob[1], bn: prob[2] })) };
      }
      throw new Error('Teorema Bayes membutuhkan 3 nilai peluang: P(A), P(B|A), dan P(B|A\').');
    }

    // --- 7. PELUANG GABUNGAN & BERSYARAT ---
    if (t.includes('irisan') || t.includes('gabungan') || t.includes('saling bebas') || (t.includes('p(a)') && t.includes('p(b)'))) {
      const solver = SOLVERS.find(s => s.id === 'gab');
      const prob = nums.filter(v => v >= 0 && v <= 1);
      if (prob.length >= 3) {
        return { solver, hasil: solver.solve(mkObj(solver, { a: prob[0], b: prob[1], ab: prob[2] })) };
      }
      throw new Error('Peluang gabungan membutuhkan nilai P(A), P(B), dan P(A ∩ B).');
    }

    throw new Error('Soal belum dapat dikenali secara otomatis. Coba periksa apakah angka-angka parameter dan kata kunci (misal: normal, binomial, kombinasi) sudah tertulis jelas.');
  }
};