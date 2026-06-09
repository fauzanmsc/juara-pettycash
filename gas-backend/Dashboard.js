/**
 * DASHBOARD CONTROLLER
 * Menangani data statistik dan grafik untuk dashboard utama
 */

function getDashboardStats(userId, role) {
  try {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // 1. Dapatkan Saldo Saat Ini
    const saldoData = getAllRecords(CONFIG.SHEETS.SALDO);
    const saldoSaatIni = saldoData.length > 0 ? saldoData[saldoData.length - 1].Saldo_Akhir : 0;

    // 2. Hitung Pengeluaran Bulan Ini
    const pengeluaranData = getAllRecords(CONFIG.SHEETS.PENGELUARAN);
    let pengeluaranBulanIni = 0;
    
    // 3. Hitung Transaksi Bulan Ini
    let totalTransaksiBulanIni = 0;

    pengeluaranData.forEach(exp => {
      const expDate = new Date(exp.Tanggal_Transaksi);
      if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
        if (exp.Status !== 'Rejected') {
          pengeluaranBulanIni += Number(exp.Nominal);
        }
        totalTransaksiBulanIni++;
      }
    });

    // 4. Hitung Approval Pending
    let approvalPending = 0;
    const persetujuanData = getAllRecords(CONFIG.SHEETS.PERSETUJUAN);
    
    // Jika rolenya manager atau direktur, hitung yg perlu diapprove
    if (role === 'head_manager' || role === 'direktur') {
       const pengajuanData = getAllRecords(CONFIG.SHEETS.PENGAJUAN);
       const statusTunggu = role === 'head_manager' ? 'Pending HM' : 'Pending Direktur';
       
       pengajuanData.forEach(p => {
         if (p.Status === statusTunggu) approvalPending++;
       });
       // Bisa ditambah logika cek pengeluaran yg butuh approval juga
    }

    return respondSuccess({
      saldo_saat_ini: saldoSaatIni,
      pengeluaran_bulan_ini: pengeluaranBulanIni,
      approval_pending: approvalPending,
      total_transaksi_bulan_ini: totalTransaksiBulanIni
    });

  } catch (error) {
    return respondError(error.message, "DASHBOARD_ERROR");
  }
}

function getChartData() {
  try {
    const pengeluaranData = getAllRecords(CONFIG.SHEETS.PENGELUARAN);
    const kategoriData = getAllRecords(CONFIG.SHEETS.KATEGORI);
    
    // Map kategori ID ke Nama
    const catMap = {};
    kategoriData.forEach(c => catMap[c.ID_Kategori] = c.Nama_Kategori);

    // Hitung per kategori
    const summaryKategori = {};
    pengeluaranData.forEach(exp => {
       const catName = catMap[exp.ID_Kategori] || 'Lainnya';
       if (!summaryKategori[catName]) summaryKategori[catName] = 0;
       summaryKategori[catName] += Number(exp.Nominal);
    });

    const categoryChart = Object.keys(summaryKategori).map(k => ({
      name: k,
      value: summaryKategori[k]
    }));

    return respondSuccess({
      kategori: categoryChart
    });

  } catch (error) {
    return respondError(error.message, "CHART_ERROR");
  }
}
