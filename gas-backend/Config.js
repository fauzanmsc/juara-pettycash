/**
 * CONFIGURATION
 * Menyimpan semua variabel konfigurasi global untuk aplikasi PettyCash
 */

const CONFIG = {
  // Ganti dengan ID Spreadsheet Anda (diambil dari URL)
  // Contoh: https://docs.google.com/spreadsheets/d/1BxiMVs0XOT5xKwgwY8145234234/edit
  // SPREADSHEET_ID adalah "1BxiMVs0XOT5xKwgwY8145234234"
  SPREADSHEET_ID: "1eDIve-EuA9Q_sEysp8E271veilLMhXw76hUAyN7Jhv8",

  // Folder ID Google Drive untuk menyimpan Nota/Kwitansi
  DRIVE_FOLDER_ID: "1zYaWBDsn9eBSdA5dxa6HzoGO8bhApl4w",

  // Nama Sheet di Database
  SHEETS: {
    PENGGUNA: "Pengguna",
    KATEGORI: "Kategori_Pengeluaran",
    PENGAJUAN: "Pengajuan_Dana",
    PERSETUJUAN: "Persetujuan",
    PENGELUARAN: "Pengeluaran_Kas_Kecil",
    SETTLEMENT: "Pertanggungjawaban",
    DETAIL_SETTLEMENT: "Detail_Pertanggungjawaban",
    REPLENISHMENT: "Replenishment",
    SALDO: "Saldo_Kas_Kecil",
    LAMPIRAN: "Lampiran_Dokumen",
    NOTIFIKASI: "Notifikasi",
    LOG_AKTIVITAS: "Log_Aktivitas",
    PENGATURAN: "Pengaturan_Sistem"
  },

  // Pengaturan Default (akan ditimpa oleh data dari sheet Pengaturan_Sistem jika ada)
  DEFAULTS: {
    SALDO_MINIMUM: 500000,
    LIMIT_PERSETUJUAN_HM: 2000000,
    LIMIT_PERSETUJUAN_DIREKTUR: 10000000,
    NAMA_PERUSAHAAN: "JEF GROUP ID"
  }
};
