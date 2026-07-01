/**
 * DUMMY DATA & DB INITIALIZATION
 * Script untuk membuat sheet dan mengisi data dummy awal
 */

function setupDatabase() {
  const ss = getDb();
  
  const tables = {
    [CONFIG.SHEETS.PENGGUNA]: ["ID_Pengguna", "Nama", "Email", "Password", "Jabatan", "Peran", "Divisi", "Status", "Tanggal_Dibuat", "Terakhir_Login", "Foto_Profil"],
    [CONFIG.SHEETS.KATEGORI]: ["ID_Kategori", "Nama_Kategori", "Keterangan", "Status", "Warna_Hex", "Icon"],
    [CONFIG.SHEETS.PENGAJUAN]: ["ID_Pengajuan", "Nomor_Pengajuan", "Tanggal_Pengajuan", "ID_Pemohon", "Divisi", "ID_Kategori", "Keperluan", "Nominal_Pengajuan", "Status", "Catatan_Approval", "Tanggal_Dibuat", "Tanggal_Diupdate"],
    [CONFIG.SHEETS.PERSETUJUAN]: ["ID_Persetujuan", "Referensi_ID", "Jenis_Dokumen", "ID_Penyetuju", "Nama_Penyetuju", "Jabatan_Penyetuju", "Aksi", "Status_Sebelum", "Status_Sesudah", "Catatan", "Tanggal_Persetujuan"],
    [CONFIG.SHEETS.TRANSAKSI]: ["ID_Transaksi", "Nomor_Transaksi", "Tanggal_Transaksi", "Tipe_Transaksi", "ID_Kategori", "Deskripsi", "Pihak_Terkait", "Nominal", "Status", "ID_Pembuat", "Tanggal_Dibuat"],
    [CONFIG.SHEETS.SETTLEMENT]: ["ID_PJ", "Nomor_Settlement", "ID_Pengajuan", "Dana_Diterima", "Total_Pengeluaran", "Selisih", "Catatan", "Status", "Tanggal_Dibuat"],
    [CONFIG.SHEETS.DETAIL_SETTLEMENT]: ["ID_Detail", "ID_PJ", "Tanggal", "ID_Kategori", "Deskripsi", "Nominal"],
    [CONFIG.SHEETS.REPLENISHMENT]: ["ID_Replenishment", "Nomor_Replenishment", "Tanggal_Pengajuan", "Saldo_Saat_Ini", "Nominal_Pengisian", "Alasan", "Status", "Tanggal_Dibuat"],
    [CONFIG.SHEETS.SALDO]: ["ID_Saldo", "Tanggal", "Saldo_Awal", "Total_Pengeluaran", "Total_Pengisian", "Saldo_Akhir"],
    [CONFIG.SHEETS.LAMPIRAN]: ["ID_Dokumen", "Referensi_ID", "Jenis_Referensi", "Nama_File", "Link_Google_Drive", "MIME_Type", "Ukuran_File", "Upload_Oleh", "Tanggal_Upload"],
    [CONFIG.SHEETS.NOTIFIKASI]: ["ID_Notifikasi", "ID_Penerima", "Judul", "Pesan", "Referensi_ID", "Jenis_Referensi", "Status_Baca", "Tanggal_Kirim", "Tanggal_Dibaca"],
    [CONFIG.SHEETS.LOG_AKTIVITAS]: ["ID_Log", "ID_Pengguna", "Nama_Pengguna", "Modul", "Aktivitas", "Keterangan", "IP_Address", "Waktu"],
    [CONFIG.SHEETS.PENGATURAN]: ["Nama_Pengaturan", "Nilai_Default", "Tipe"]
  };

  for (const sheetName in tables) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    // Set headers
    const headers = tables[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f4f6");
  }

  Logger.log("Database Setup Selesai.");
}

function generateDummyData() {
  const ss = getDb();
  
  // 1. Kategori
  const kategoriSheet = ss.getSheetByName(CONFIG.SHEETS.KATEGORI);
  if (kategoriSheet.getLastRow() <= 1) {
    const dummyKategori = [
      ["KAT-001", "Transportasi", "Biaya perjalanan, bensin, tol", "active", "#3b82f6", "Car"],
      ["KAT-002", "Konsumsi", "Makan siang meeting, snack", "active", "#ef4444", "Pizza"],
      ["KAT-003", "ATK", "Alat Tulis Kantor", "active", "#eab308", "Scissors"],
      ["KAT-004", "Operasional", "Biaya operasional umum", "active", "#8b5cf6", "Monitor"],
      ["KAT-005", "Maintenance", "Perawatan inventaris", "active", "#10b981", "Scissors"],
      ["KAT-006", "Lain-lain", "Biaya tidak terduga", "active", "#6366f1", "Tags"]
    ];
    kategoriSheet.getRange(2, 1, dummyKategori.length, dummyKategori[0].length).setValues(dummyKategori);
  }

  // 2. Pengguna
  const penggunaSheet = ss.getSheetByName(CONFIG.SHEETS.PENGGUNA);
  if (penggunaSheet.getLastRow() <= 1) {
    const dummyPengguna = [
      ["USR-001", "Budi Santoso", "admin@jefgroup.com", "password123", "Admin Finance", "admin_finance", "Finance Department", "active", new Date().toISOString(), new Date().toISOString(), ""],
      ["USR-002", "Siti Rahma", "hm@jefgroup.com", "password123", "Head Manager", "head_manager", "Finance Department", "active", new Date().toISOString(), new Date().toISOString(), ""],
      ["USR-003", "Ahmad Direktur", "direktur@jefgroup.com", "password123", "Direktur", "direktur", "Direksi", "active", new Date().toISOString(), new Date().toISOString(), ""]
    ];
    penggunaSheet.getRange(2, 1, dummyPengguna.length, dummyPengguna[0].length).setValues(dummyPengguna);
  }

  // 3. Saldo Awal
  const saldoSheet = ss.getSheetByName(CONFIG.SHEETS.SALDO);
  if (saldoSheet.getLastRow() <= 1) {
    const dummySaldo = [
      [generateUUID(), new Date().toISOString().split('T')[0], 10000000, 0, 0, 10000000]
    ];
    saldoSheet.getRange(2, 1, dummySaldo.length, dummySaldo[0].length).setValues(dummySaldo);
  }

  Logger.log("Data Dummy Berhasil Digenerate.");
}
