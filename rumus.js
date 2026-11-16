/* ====== RUMUS Probstat ======
   File ini hanya berisi rumus & langkah penyelesaian (tanpa tampilan).
   Dipakai oleh script.js (kalkulator) dan penjawab.js (tanya soal).
   Cara menambah jenis soal baru: tambahkan satu objek di array SOLVERS (paling bawah).
   Isinya: id, g (nama grup), t (judul), info, f (daftar input), ex (contoh), solve(g). */

/* ---------- Fungsi bantu ---------- */
const fmt = (x, d = 6) => !isFinite(x) ? String(x) : (x !== 0 && Math.abs(x) < 1e-4) ? x.toExponential(3) : String(+x.toFixed(d));
const sum = a => a.reduce((s, v) => s + v, 0);
const median = a => { const n = a.length, m = n >> 1; return n % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
const S = (h, ...l) => ({ h, l });

/* ---------- Fungsi peluang (numerik) ---------- */
function lg(x) { // log-gamma (Lanczos)
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x, t = x + 5.5, s = 1.000000000190015;
  t -= (x + 0.5) * Math.log(t);
  for (const k of c) s += k / ++y;
  return -t + Math.log(2.5066282746310005 * s / x);
}
function gP(a, x) { // gamma tak lengkap teregularisasi P(a,x)
  if (x <= 0) return 0;
  const g = lg(a);
  if (x < a + 1) {
    let ap = a, s = 1 / a, d = s;
    for (let i = 0; i < 500; i++) { ap++; d *= x / ap; s += d; if (Math.abs(d) < Math.abs(s) * 1e-15) break; }
    return s * Math.exp(-x + a * Math.log(x) - g);
  }
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-15) break;
  }
  return 1 - Math.exp(-x + a * Math.log(x) - g) * h;
}
const erf = x => x < 0 ? -gP(0.5, x * x) : gP(0.5, x * x);
const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));           // CDF normal baku
const bisect = (f, lo, hi) => { for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; f(m) < 0 ? lo = m : hi = m; } return (lo + hi) / 2; };
const zq = p => bisect(z => Phi(z) - p, -40, 40);              // kuantil normal baku (kebalikan Φ)
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const comb = (n, r) => { r = Math.min(r, n - r); let c = 1; for (let i = 1; i <= r; i++) c = c * (n - r + i) / i; return Math.round(c); };
const perm = (n, r) => { let p = 1; for (let i = 0; i < r; i++) p *= n - i; return p; };
const fact = n => perm(n, n);

/* ---------- Daftar jenis soal ---------- */
const SOLVERS = [
{
  id: 'desk', g: 'Statistika deskriptif', t: 'Pemusatan & penyebaran data',
  info: 'Masukkan data mentah. Pisahkan dengan spasi, koma, atau baris baru; desimal pakai titik. Kuartil dihitung dengan median dari belahan bawah dan atas data.',
  f: [{ id: 'd', l: 'Data', type: 'area', ph: '60 72 75 75 80 83 85 90 95' }],
  ex: { d: '60 72 75 75 80 83 85 90 95' },
  solve(g) {
    const x = g.list('d').sort((a, b) => a - b), n = x.length, sm = sum(x), m = sm / n;
    const med = median(x), h = n >> 1, q1 = median(x.slice(0, h)), q3 = median(x.slice(n - h));
    const fr = {}; x.forEach(v => fr[v] = (fr[v] || 0) + 1);
    const mx = Math.max(...Object.values(fr));
    const mod = mx === 1 ? 'tidak ada (semua data muncul 1 kali)' : Object.keys(fr).filter(k => fr[k] === mx).join(', ') + ` (muncul ${mx} kali)`;
    const ss = sum(x.map(v => (v - m) ** 2)), vs = ss / (n - 1), vp = ss / n;
    return {
      steps: [
        S('Urutkan data', x.join(', ') + `   (n = ${n})`),
        S('Rata-rata', 'x̄ = Σx / n', `x̄ = ${fmt(sm)} / ${n} = ${fmt(m)}`),
        S('Median', n % 2 ? `n ganjil → data ke-${(n + 1) / 2}` : `n genap → rata-rata data ke-${n / 2} dan ke-${n / 2 + 1}`, `Me = ${fmt(med)}`),
        S('Modus', mod),
        S('Jangkauan dan kuartil', `R = maks − min = ${fmt(x[n - 1])} − ${fmt(x[0])} = ${fmt(x[n - 1] - x[0])}`, `Q1 = ${fmt(q1)},  Q3 = ${fmt(q3)}`, `IQR = Q3 − Q1 = ${fmt(q3 - q1)}`),
        S('Varians dan simpangan baku', `Σ(x − x̄)² = ${fmt(ss)}`, `s² = Σ(x − x̄)² / (n − 1) = ${fmt(ss)} / ${n - 1} = ${fmt(vs)}`, `s = √s² = ${fmt(Math.sqrt(vs))}`, `Jika data populasi: σ² = Σ(x − x̄)² / n = ${fmt(vp)},  σ = ${fmt(Math.sqrt(vp))}`)
      ],
      ans: [['Rata-rata', fmt(m)], ['Median', fmt(med)], ['Modus', mod], ['Varians sampel (s²)', fmt(vs)], ['Simpangan baku sampel (s)', fmt(Math.sqrt(vs))]]
    };
  }
},
{
  id: 'komb', g: 'Peluang', t: 'Permutasi & kombinasi',
  info: 'Menghitung banyak cara memilih r objek dari n objek.',
  f: [{ id: 'n', l: 'n (jumlah objek)' }, { id: 'r', l: 'r (yang dipilih)' }],
  ex: { n: 10, r: 3 },
  solve(g) {
    const n = g.num('n', { int: 1, min: 0, max: 170 }), r = g.num('r', { int: 1, min: 0, max: n });
    const p = perm(n, r), c = comb(n, r);
    return {
      steps: [
        S('Permutasi (urutan diperhatikan)', 'nPr = n! / (n − r)!', `${n}P${r} = ${n}! / ${n - r}! = ${fmt(p)}`),
        S('Kombinasi (urutan tidak diperhatikan)', 'nCr = n! / (r! (n − r)!)', `${n}C${r} = ${n}! / (${r}! · ${n - r}!) = ${fmt(c)}`)
      ],
      ans: [[`Permutasi ${n}P${r}`, fmt(p)], [`Kombinasi ${n}C${r}`, fmt(c)]]
    };
  }
},
{
  id: 'gab', g: 'Peluang', t: 'Peluang kejadian A dan B',
  info: 'Isi P(A), P(B), dan P(A ∩ B) (peluang A dan B terjadi bersamaan). Nilai antara 0 dan 1.',
  f: [{ id: 'a', l: 'P(A)' }, { id: 'b', l: 'P(B)' }, { id: 'ab', l: 'P(A ∩ B)' }],
  ex: { a: 0.5, b: 0.4, ab: 0.2 },
  solve(g) {
    const o = { min: 0, max: 1 }, a = g.num('a', o), b = g.num('b', o), ab = g.num('ab', o);
    if (ab > Math.min(a, b)) throw Error('P(A ∩ B) tidak boleh lebih besar dari P(A) atau P(B).');
    const u = a + b - ab, bs = b > 0 ? ab / b : NaN, as = a > 0 ? ab / a : NaN, bebas = Math.abs(a * b - ab) < 1e-9;
    return {
      steps: [
        S('Gabungan', 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)', `= ${fmt(a)} + ${fmt(b)} − ${fmt(ab)} = ${fmt(u)}`),
        S('Peluang bersyarat', 'P(A | B) = P(A ∩ B) / P(B)', `= ${fmt(ab)} / ${fmt(b)} = ${fmt(bs)}`, 'P(B | A) = P(A ∩ B) / P(A)', `= ${fmt(ab)} / ${fmt(a)} = ${fmt(as)}`),
        S('Cek kebebasan', 'A dan B bebas jika P(A) · P(B) = P(A ∩ B)', `${fmt(a)} · ${fmt(b)} = ${fmt(a * b)}  ${bebas ? '=' : '≠'}  ${fmt(ab)}`, bebas ? 'Kejadian A dan B saling bebas.' : 'Kejadian A dan B tidak saling bebas.')
      ],
      ans: [['P(A ∪ B)', fmt(u)], ['P(A | B)', fmt(bs)], ['P(B | A)', fmt(as)], ['Saling bebas?', bebas ? 'Ya' : 'Tidak']]
    };
  }
},
{
  id: 'bayes', g: 'Peluang', t: 'Teorema Bayes',
  info: 'Cari peluang penyebab A setelah B diketahui terjadi. Contoh: A = sakit, B = hasil tes positif.',
  f: [{ id: 'a', l: 'P(A)' }, { id: 'ba', l: 'P(B | A)' }, { id: 'bn', l: "P(B | A')", h: 'peluang B jika A tidak terjadi' }],
  ex: { a: 0.01, ba: 0.95, bn: 0.05 },
  solve(g) {
    const o = { min: 0, max: 1 }, a = g.num('a', o), ba = g.num('ba', o), bn = g.num('bn', o);
    const pb = ba * a + bn * (1 - a);
    if (pb === 0) throw Error('P(B) = 0, sehingga P(A | B) tidak terdefinisi.');
    const r = ba * a / pb;
    return {
      steps: [
        S('Peluang komplemen', "P(A') = 1 − P(A)", `= 1 − ${fmt(a)} = ${fmt(1 - a)}`),
        S('Peluang total B', "P(B) = P(B | A) P(A) + P(B | A') P(A')", `= ${fmt(ba)} · ${fmt(a)} + ${fmt(bn)} · ${fmt(1 - a)} = ${fmt(pb)}`),
        S('Teorema Bayes', 'P(A | B) = P(B | A) P(A) / P(B)', `= ${fmt(ba * a)} / ${fmt(pb)} = ${fmt(r)}`)
      ],
      ans: [['P(B)', fmt(pb)], ['P(A | B)', `${fmt(r)} (${fmt(r * 100, 3)}%)`]]
    };
  }
},
{
  id: 'binom', g: 'Distribusi', t: 'Distribusi binomial',
  info: 'n percobaan bebas, tiap percobaan sukses dengan peluang p. X = banyak sukses.',
  f: [{ id: 'n', l: 'n (percobaan)' }, { id: 'p', l: 'p (peluang sukses)' }, { id: 'x', l: 'x (banyak sukses)' }],
  ex: { n: 10, p: 0.3, x: 4 },
  solve(g) {
    const n = g.num('n', { int: 1, min: 1, max: 1000 }), p = g.num('p', { min: 0, max: 1 }), x = g.num('x', { int: 1, min: 0, max: n });
    const pm = k => comb(n, k) * p ** k * (1 - p) ** (n - k);
    const eq = pm(x); let le = 0; for (let k = 0; k <= x; k++) le += pm(k);
    let ge = 0; for (let k = x; k <= n; k++) ge += pm(k);
    return {
      steps: [
        S('Rumus peluang', 'P(X = x) = C(n, x) · p^x · (1 − p)^(n − x)', `P(X = ${x}) = C(${n}, ${x}) · ${fmt(p)}^${x} · ${fmt(1 - p)}^${n - x}`, `= ${fmt(comb(n, x))} · ${fmt(p ** x)} · ${fmt((1 - p) ** (n - x))} = ${fmt(eq)}`),
        S('Peluang kumulatif', `P(X ≤ ${x}) = Σ P(X = k) untuk k = 0 sampai ${x} = ${fmt(le)}`, `P(X ≥ ${x}) = Σ P(X = k) untuk k = ${x} sampai ${n} = ${fmt(ge)}`),
        S('Rata-rata dan varians', `μ = n·p = ${fmt(n * p)}`, `σ² = n·p·(1 − p) = ${fmt(n * p * (1 - p))},  σ = ${fmt(Math.sqrt(n * p * (1 - p)))}`)
      ],
      ans: [[`P(X = ${x})`, fmt(eq)], [`P(X ≤ ${x})`, fmt(le)], [`P(X ≥ ${x})`, fmt(ge)], ['Rata-rata (μ)', fmt(n * p)]]
    };
  }
},
{
  id: 'normal', g: 'Distribusi', t: 'Distribusi normal',
  info: 'Ubah nilai X menjadi skor Z, lalu cari luas di bawah kurva normal baku.',
  f: [{ id: 'mu', l: 'μ (rata-rata)' }, { id: 'sd', l: 'σ (simpangan baku)' },
      { id: 'j', l: 'Yang dicari', type: 'sel', o: ['P(X < a)', 'P(X > a)', 'P(a < X < b)'] },
      { id: 'a', l: 'a' }, { id: 'b', l: 'b', h: 'isi hanya untuk P(a < X < b)' }],
  ex: { mu: 70, sd: 10, j: 2, a: 60, b: 85 },
  solve(g) {
    const mu = g.num('mu'), sd = g.num('sd', { min: 0.000001 }), j = g.sel('j'), a = g.num('a'), b = j === 2 ? g.num('b') : null;
    if (j === 2 && b <= a) throw Error('Nilai b harus lebih besar dari a.');
    const za = (a - mu) / sd, zb = j === 2 ? (b - mu) / sd : 0;
    const st = [S('Ubah ke skor Z', 'Z = (X − μ) / σ', `Za = (${fmt(a)} − ${fmt(mu)}) / ${fmt(sd)} = ${fmt(za, 4)}`)];
    if (j === 2) st[0].l.push(`Zb = (${fmt(b)} − ${fmt(mu)}) / ${fmt(sd)} = ${fmt(zb, 4)}`);
    let r, lab;
    if (j === 0) { r = Phi(za); lab = `P(X < ${fmt(a)})`; st.push(S('Luas kurva', `P(Z < ${fmt(za, 4)}) = Φ(${fmt(za, 4)}) = ${fmt(r)}`)); }
    else if (j === 1) { r = 1 - Phi(za); lab = `P(X > ${fmt(a)})`; st.push(S('Luas kurva', `P(Z > ${fmt(za, 4)}) = 1 − Φ(${fmt(za, 4)}) = 1 − ${fmt(Phi(za))} = ${fmt(r)}`)); }
    else { r = Phi(zb) - Phi(za); lab = `P(${fmt(a)} < X < ${fmt(b)})`; st.push(S('Luas kurva', `P(${fmt(za, 4)} < Z < ${fmt(zb, 4)}) = Φ(${fmt(zb, 4)}) − Φ(${fmt(za, 4)})`, `= ${fmt(Phi(zb))} − ${fmt(Phi(za))} = ${fmt(r)}`)); }
    return { steps: st, ans: [[lab, `${fmt(r)} (${fmt(r * 100, 3)}%)`]] };
  }
},
{
  id: 'reg', g: 'Regresi', t: 'Regresi & korelasi linear',
  info: 'Masukkan pasangan data X dan Y dengan urutan yang sama dan jumlah yang sama.',
  f: [{ id: 'x', l: 'Data X', type: 'area' }, { id: 'y', l: 'Data Y', type: 'area' }, { id: 'x0', l: 'Prediksi Y untuk X =', h: 'opsional' }],
  ex: { x: '1 2 3 4 5', y: '2 4 5 4 6', x0: 6 },
  solve(g) {
    const x = g.list('x', 3), y = g.list('y', 3), x0 = g.num('x0', { opt: 1 });
    if (x.length !== y.length) throw Error(`Jumlah data X (${x.length}) dan Y (${y.length}) harus sama.`);
    const n = x.length, sx = sum(x), sy = sum(y), sxy = sum(x.map((v, i) => v * y[i])), sxx = sum(x.map(v => v * v)), syy = sum(y.map(v => v * v));
    const dx = n * sxx - sx * sx, dy = n * syy - sy * sy;
    if (dx === 0 || dy === 0) throw Error('Data X atau Y tidak boleh bernilai sama semua.');
    const b = (n * sxy - sx * sy) / dx, a = sy / n - b * sx / n, r = (n * sxy - sx * sy) / Math.sqrt(dx * dy);
    const st = [
      S('Hitung jumlah', `n = ${n},  Σx = ${fmt(sx)},  Σy = ${fmt(sy)}`, `Σxy = ${fmt(sxy)},  Σx² = ${fmt(sxx)},  Σy² = ${fmt(syy)}`),
      S('Kemiringan (b)', 'b = (nΣxy − ΣxΣy) / (nΣx² − (Σx)²)', `b = (${n}·${fmt(sxy)} − ${fmt(sx)}·${fmt(sy)}) / (${n}·${fmt(sxx)} − ${fmt(sx)}²) = ${fmt(b)}`),
      S('Intersep (a)', 'a = ȳ − b·x̄', `a = ${fmt(sy / n)} − ${fmt(b)}·${fmt(sx / n)} = ${fmt(a)}`),
      S('Koefisien korelasi', 'r = (nΣxy − ΣxΣy) / √[(nΣx² − (Σx)²)(nΣy² − (Σy)²)]', `r = ${fmt(r, 5)},  r² = ${fmt(r * r, 5)}`)
    ];
    const ans = [['Persamaan', `Y = ${fmt(a, 4)} ${b < 0 ? '−' : '+'} ${fmt(Math.abs(b), 4)}X`], ['Korelasi (r)', fmt(r, 4)], ['Determinasi (r²)', fmt(r * r, 4)]];
    if (x0 !== null) { st.push(S('Prediksi', `Y = ${fmt(a)} + ${fmt(b)} · ${fmt(x0)} = ${fmt(a + b * x0)}`)); ans.push([`Y saat X = ${fmt(x0)}`, fmt(a + b * x0, 4)]); }
    return { steps: st, ans };
  }
}
];

/* ---------- Pembaca input ---------- */
function mk(form) {
  const el = id => form.elements[id], raw = id => el(id).value.trim(), nm = id => el(id).closest('label').dataset.n;
  return {
    num(id, o = {}) {
      const s = raw(id).replace(',', '.');
      if (s === '') { if (o.opt) return null; throw Error(`${nm(id)} belum diisi.`); }
      const v = Number(s);
      if (!isFinite(v)) throw Error(`${nm(id)} harus berupa angka.`);
      if (o.int && !Number.isInteger(v)) throw Error(`${nm(id)} harus bilangan bulat.`);
      if (o.min != null && v < o.min) throw Error(`${nm(id)} minimal ${o.min}.`);
      if (o.max != null && v > o.max) throw Error(`${nm(id)} maksimal ${o.max}.`);
      return v;
    },
    list(id, min = 2) {
      const a = raw(id).split(/[\s,;]+/).filter(Boolean).map(Number);
      if (a.some(v => !isFinite(v))) throw Error(`${nm(id)} hanya boleh berisi angka.`);
      if (a.length < min) throw Error(`${nm(id)} minimal ${min} angka.`);
      return a;
    },
    sel: id => +el(id).value
  };
}

/* Menjalankan solver dari objek nilai biasa, mis. mkObj(solver, { n: 10, p: 0.25, x: 3 }) */
function mkObj(solver, v) {
  const elements = {};
  solver.f.forEach(f => { elements[f.id] = { value: v[f.id] == null ? '' : String(v[f.id]), closest: () => ({ dataset: { n: f.l } }) }; });
  return mk({ elements });
}