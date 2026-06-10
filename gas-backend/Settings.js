/**
 * SETTINGS CONTROLLER
 * Menangani pengambilan dan pembaruan pengaturan sistem
 */

function getSettings() {
  try {
    const records = getAllRecords(CONFIG.SHEETS.PENGATURAN);
    
    // Gabungkan dengan default config jika belum ada di database
    let settings = { ...CONFIG.DEFAULTS };
    
    records.forEach(row => {
      if (row.Nama_Pengaturan) {
        let value = row.Nilai_Default;
        if (row.Tipe === 'number') value = Number(value);
        if (row.Tipe === 'boolean') value = (value === 'true' || value === true);
        settings[row.Nama_Pengaturan] = value;
      }
    });

    return respondSuccess(settings);
  } catch (error) {
    return respondError("Gagal mengambil pengaturan: " + error.message, "INTERNAL_ERROR");
  }
}

function updateSettings(payload, userId) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.PENGATURAN);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Konversi payload object ke array untuk update
    // payload: { SALDO_MINIMUM: 500000, NAMA_PERUSAHAAN: "JEF GROUP" }
    
    for (const key in payload) {
      let value = payload[key];
      let type = typeof value;
      let found = false;
      
      // Cari key di sheet
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === key) { // Kolom 0 adalah Nama_Pengaturan
          sheet.getRange(i + 1, 2).setValue(value); // Kolom 2 adalah Nilai_Default
          found = true;
          break;
        }
      }
      
      // Jika tidak ditemukan, tambahkan baris baru
      if (!found) {
        sheet.appendRow([key, value, type]);
      }
    }
    
    if (userId) {
      logActivity(userId, "Admin", "Pengaturan", "update", "Memperbarui konfigurasi sistem");
    }

    return respondSuccess({ message: "Pengaturan berhasil diperbarui" });
  } catch (error) {
    return respondError("Gagal memperbarui pengaturan: " + error.message, "INTERNAL_ERROR");
  }
}
