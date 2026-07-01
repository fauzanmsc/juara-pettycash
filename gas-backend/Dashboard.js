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
    const transaksiData = getAllRecords(CONFIG.SHEETS.TRANSAKSI);
    let pengeluaranBulanIni = 0;
    
    // 3. Hitung Transaksi Bulan Ini
    let totalTransaksiBulanIni = 0;

    transaksiData.forEach(trx => {
      const expDate = new Date(trx.Tanggal_Transaksi);
      if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
        if (trx.Status !== 'Rejected' && trx.Tipe_Transaksi === 'Pengeluaran') {
          pengeluaranBulanIni += Number(trx.Nominal);
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
    const transaksiData = getAllRecords(CONFIG.SHEETS.TRANSAKSI);
    const kategoriData = getAllRecords(CONFIG.SHEETS.KATEGORI);
    
    // Map kategori ID ke Nama dan Warna_Hex
    const catMap = {};
    const colorMap = {};
    kategoriData.forEach(c => {
      catMap[c.ID_Kategori] = c.Nama_Kategori;
      if (c.Warna_Hex) {
        colorMap[c.Nama_Kategori] = c.Warna_Hex;
      }
    });

    // Hitung per kategori (Hanya Pengeluaran)
    const summaryKategori = {};
    transaksiData.forEach(trx => {
       if (trx.Tipe_Transaksi === 'Pengeluaran') {
         const catName = catMap[trx.ID_Kategori] || 'Lainnya';
         if (!summaryKategori[catName]) summaryKategori[catName] = 0;
         summaryKategori[catName] += Number(trx.Nominal);
       }
    });

    const categoryChart = Object.keys(summaryKategori).map(k => ({
      name: k,
      value: summaryKategori[k],
      Warna_Hex: colorMap[k] || null
    }));

    // Data mentah untuk trend (agar frontend bisa filter Mingguan/Bulanan)
    const rawTrend = transaksiData
      .filter(trx => trx.Status !== 'Rejected' && trx.Status !== 'Ditolak' && trx.Tipe_Transaksi === 'Pengeluaran')
      .map(trx => ({
        date: trx.Tanggal_Transaksi,
        amount: Number(trx.Nominal)
      }));

    return respondSuccess({
      kategori: categoryChart,
      raw_trend: rawTrend
    });

  } catch (error) {
    return respondError(error.message, "CHART_ERROR");
  }
}
