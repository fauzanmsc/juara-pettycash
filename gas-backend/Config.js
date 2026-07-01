/**
 * CONFIGURATION
 * Menyimpan semua variabel konfigurasi global untuk aplikasi PettyCash
 */

const CONFIG = {

  SPREADSHEET_ID: "1eDIve-EuA9Q_sEysp8E271veilLMhXw76hUAyN7Jhv8",

  // Folder ID Google Drive untuk menyimpan Nota/Kwitansi
  DRIVE_FOLDER_ID: "19WQVOiX8elXXZ8XRKWaPRQCUdMsWJ6oA",

  // Nama Sheet di Database
  SHEETS: {
    PENGGUNA: "Pengguna",
    KATEGORI: "Kategori",
    PENGAJUAN: "Pengajuan",
    PERSETUJUAN: "Persetujuan",
    TRANSAKSI: "Transaksi",
    SETTLEMENT: "Settlement",
    DETAIL_SETTLEMENT: "Detail",
    REPLENISHMENT: "Replenishment",
    SALDO: "Saldo",
    LAMPIRAN: "Lampiran",
    NOTIFIKASI: "Notifikasi",
    LOG_AKTIVITAS: "Log",
    PENGATURAN: "Pengaturan"
  },

  // Pengaturan Default (akan ditimpa oleh data dari sheet Pengaturan_Sistem jika ada)
  DEFAULTS: {
    SALDO_MINIMUM: 500000,
    LIMIT_PERSETUJUAN_HM: 2000000,
    LIMIT_PERSETUJUAN_DIREKTUR: 10000000,
    NAMA_PERUSAHAAN: "JEF GROUP ID"
  }
};
