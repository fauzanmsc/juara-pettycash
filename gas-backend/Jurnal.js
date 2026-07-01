/**
 * JURNAL CONTROLLER
 * Menangani pengambilan data jurnal keuangan
 */

function getJurnal() {
  try {
    const transaksiData = getAllRecords(CONFIG.SHEETS.TRANSAKSI);
    const replenishmentData = getAllRecords(CONFIG.SHEETS.REPLENISHMENT);
    const kategoriData = getAllRecords(CONFIG.SHEETS.KATEGORI);
    
    // Map kategori
    const catMap = {};
    kategoriData.forEach(c => catMap[c.ID_Kategori] = c.Nama_Kategori);

    let jurnalEntries = [];

    // 1. Ambil data Transaksi (Debit atau Kredit)
    transaksiData.forEach(trx => {
      if (trx.Status === 'Disetujui' || trx.Status === 'Selesai') {
        const isPemasukan = trx.Tipe_Transaksi === 'Pemasukan';
        jurnalEntries.push({
          id: trx.ID_Transaksi,
          tanggal: trx.Tanggal_Transaksi || trx.Tanggal_Dibuat,
          keterangan: trx.Deskripsi,
          kategori: catMap[trx.ID_Kategori] || 'Lainnya',
          rekening: trx.Pihak_Terkait || 'Kas Kecil',
          debit: isPemasukan ? Number(trx.Nominal) : 0,
          kredit: !isPemasukan ? Number(trx.Nominal) : 0,
          tipe: trx.Tipe_Transaksi.toLowerCase()
        });
      }
    });

    // 2. Ambil data Replenishment (Debit)
    replenishmentData.forEach(rep => {
      if (rep.Status === 'Disetujui' || rep.Status === 'Selesai') {
        jurnalEntries.push({
          id: rep.ID_Replenishment,
          tanggal: rep.Tanggal_Pengajuan || rep.Tanggal_Dibuat,
          keterangan: 'Top Up: ' + rep.Alasan,
          kategori: 'Kas Masuk',
          rekening: 'Bank',
          debit: Number(rep.Nominal_Pengisian),
          kredit: 0,
          tipe: 'replenishment'
        });
      }
    });

    // Urutkan berdasarkan tanggal terlama ke terbaru
    jurnalEntries.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

    // Hitung running balance
    let currentBalance = 0;
    jurnalEntries = jurnalEntries.map(entry => {
      currentBalance += entry.debit;
      currentBalance -= entry.kredit;
      entry.balance = currentBalance;
      return entry;
    });

    // Urutkan kembali berdasarkan terbaru ke terlama untuk ditampilkan di tabel
    jurnalEntries.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    return respondSuccess(jurnalEntries);
  } catch (error) {
    return respondError(error.message, "GET_JURNAL_ERROR");
  }
}

