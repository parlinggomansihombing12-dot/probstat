/* ====== TAMPILAN TANYA SOAL (tanya.js) ======
   Menyediakan form input soal, chips contoh soal,
   dan merender hasil langkah pengerjaan serta jawaban akhir.
*/

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('tanyaApp');
  if (!container) return;

  // Render Form UI
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <label for="inputSoalCerita" style="display: block; font-weight: 600; margin-bottom: 6px;">
          Tuliskan atau tempelkan soal cerita di sini:
        </label>
        <textarea id="inputSoalCerita" rows="4" 
          placeholder="Contoh: Dari 12 siswa akan dipilih 4 orang untuk pengurus kelas. Berapa banyak cara memilihnya?" 
          style="width: 100%; box-sizing: border-box; padding: 12px; font-family: inherit; font-size: 15px; border: 1px solid var(--garis, #d1d5db); border-radius: 8px; resize: vertical;"></textarea>
      </div>

      <div>
        <span style="font-size: 13px; color: var(--abu, #64748b); font-weight: 500;">Contoh soal siap coba:</span>
        <div style="margin-top: 6px; display: flex; flex-wrap: wrap; gap: 6px;">
          <button type="button" class="btn-chip" data-q="Dari 10 orang mahasiswa akan dipilih 3 orang sebagai delegasi. Berapa banyak cara memilihnya?">Kombinasi</button>
          <button type="button" class="btn-chip" data-q="Sebuah koin dilempar sebanyak 10 kali dengan peluang muncul gambar 0.3. Berapa peluang muncul tepat 4 gambar?">Binomial</button>
          <button type="button" class="btn-chip" data-q="Nilai tes berdistribusi normal dengan rata-rata 70 dan simpangan baku 10. Tentukan peluang nilai lebih dari 85!">Normal</button>
          <button type="button" class="btn-chip" data-q="Data nilai: 60, 72, 75, 75, 80, 83, 85, 90, 95. Hitung rata-rata, median, dan simpangan bakunya!">Deskriptif</button>
        </div>
      </div>

      <div>
        <button id="btnJawabSoal" style="padding: 10px 20px; font-weight: 600; font-size: 15px; background: #2563eb; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
          Jawab Soal Ini
        </button>
      </div>

      <div id="wadahHasilSoal" style="margin-top: 10px;"></div>
    </div>
  `;

  // Styling chip tombol contoh
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .btn-chip {
      background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 999px;
      padding: 4px 12px; font-size: 13px; cursor: pointer; color: #334155;
      transition: all .15s ease;
    }
    .btn-chip:hover {
      background: #e2e8f0; border-color: #94a3b8;
    }
  `;
  document.head.appendChild(styleEl);

  const inputSoal = document.getElementById('inputSoalCerita');
  const btnJawab = document.getElementById('btnJawabSoal');
  const hasilBox = document.getElementById('wadahHasilSoal');

  // Event klik contoh soal
  container.querySelectorAll('.btn-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      inputSoal.value = btn.dataset.q;
      eksekusi();
    });
  });

  // Event klik tombol Jawab
  btnJawab.addEventListener('click', eksekusi);

  function eksekusi() {
    hasilBox.innerHTML = '';
    try {
      const res = PenjawabSoal.jawab(inputSoal.value);
      tampilkanJawaban(res);
    } catch (err) {
      hasilBox.innerHTML = `
        <div style="padding: 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; color: #991b1b; font-size: 14px;">
          <strong>Belum bisa dijawab:</strong> ${esc(err.message)}
        </div>
      `;
    }
  }

  function tampilkanJawaban({ solver, hasil }) {
    let html = `
      <div style="background: #fff; border: 1px solid var(--garis, #e2e8f0); border-radius: 8px; padding: 20px;">
        <div style="display: inline-block; background: #eff6ff; color: #1d4ed8; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-bottom: 12px;">
          ${esc(solver.g)} • ${esc(solver.t)}
        </div>
        <h3 style="margin: 0 0 16px 0; font-size: 18px;">Langkah Penyelesaian:</h3>
        <div style="display: flex; flex-direction: column; gap: 14px;">
    `;

    // Render Steps
    hasil.steps.forEach((step, idx) => {
      html += `
        <div style="border-left: 3px solid #2563eb; padding-left: 12px;">
          <div style="font-weight: 600; color: #1e293b; margin-bottom: 3px;">${idx + 1}. ${esc(step.h)}</div>
          <div style="font-family: 'STIX Two Text', serif, monospace; font-size: 14px; color: #475569; line-height: 1.6;">
            ${step.l.map(line => `<div>${esc(line)}</div>`).join('')}
          </div>
        </div>
      `;
    });

    html += `</div>`;

    // Render Summary Answers
    html += `
      <div style="margin-top: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px;">
        <div style="font-weight: 700; color: #0f172a; margin-bottom: 8px; font-size: 14px;">Hasil Akhir:</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    `;

    hasil.ans.forEach(([label, nilai]) => {
      html += `
        <tr style="border-bottom: 1px solid #edf2f7;">
          <td style="padding: 6px 0; color: #475569;">${esc(label)}</td>
          <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #0f172a;">${esc(nilai)}</td>
        </tr>
      `;
    });

    html += `
        </table>
      </div>
    </div>`;

    hasilBox.innerHTML = html;
  }
});