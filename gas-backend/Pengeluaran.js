/**
 * PENGELUARAN CONTROLLER
 * Menangani pencatatan pengeluaran (expense)
 */

function getPengeluaranList() {
  try {
    const data = getAllRecords(CONFIG.SHEETS.PENGELUARAN);
    return respondSuccess(data);
  } catch (error) {
    return respondError(error.message, "GET_PENGELUARAN_ERROR");
  }
}

function createPengeluaran(payload) {
  try {
    const { userId, categoryId, deskripsi, vendor, nominal, fileData, fileName, fileMimeType } = payload;
    
    if (!userId || !categoryId || !nominal) {
      return respondError("Data tidak lengkap", "INVALID_PAYLOAD");
    }

    // Nomor Transaksi EXP-YYYYMMDD-XXX
    const todayStr = formatDateForNumber(new Date(), "EXP-");
    const data = getAllRecords(CONFIG.SHEETS.PENGELUARAN);
    const todayRecords = data.filter(p => p.Nomor_Transaksi && p.Nomor_Transaksi.startsWith(todayStr));
    const nextNum = (todayRecords.length + 1).toString().padStart(3, '0');
    const noTransaksi = `${todayStr}-${nextNum}`;

    const record = {
      "ID_Pengeluaran": generateUUID("OUT"),
      "Nomor_Transaksi": noTransaksi,
      "Tanggal_Transaksi": new Date().toISOString().split('T')[0],
      "ID_Kategori": categoryId,
      "Deskripsi": deskripsi || "-",
      "Vendor": vendor || "-",
      "Nominal": Number(nominal),
      "Status": "Pending Review", // Menunggu disetujui (Admin/HM)
      "ID_Pembuat": userId,
      "Tanggal_Dibuat": new Date().toISOString(),
      "URL_Lampiran": ""
    };
    
    if (fileData && fileName && fileMimeType) {
      const fileUrl = uploadFileToDrive(fileData, fileName, fileMimeType);
      if (fileUrl) {
        record["URL_Lampiran"] = fileUrl;
      }
    }

    insertRecord(CONFIG.SHEETS.PENGELUARAN, record);
    logActivity(userId, "System", "Pengeluaran", "Create", `Mencatat pengeluaran baru: ${noTransaksi}`);

    return respondSuccess(record, "Pengeluaran berhasil dicatat");
  } catch (error) {
    return respondError(error.message, "CREATE_PENGELUARAN_ERROR");
  }
}
