/**
 * TRANSAKSI CONTROLLER
 * Menangani pencatatan transaksi (Pemasukan dan Pengeluaran)
 */

function getTransaksiList() {
  try {
    const data = getAllRecords(CONFIG.SHEETS.TRANSAKSI);
    return respondSuccess(data);
  } catch (error) {
    return respondError(error.message, "GET_TRANSAKSI_ERROR");
  }
}

function createTransaksi(payload) {
  try {
    const { userId, tipeTransaksi, categoryId, deskripsi, pihakTerkait, nominal, fileData, fileName, fileMimeType } = payload;
    
    if (!userId || !tipeTransaksi || !categoryId || !nominal) {
      return respondError("Data tidak lengkap", "INVALID_PAYLOAD");
    }

    // Nomor Transaksi (TRX-YYYYMMDD-XXX)
    const prefix = tipeTransaksi === "Pemasukan" ? "IN-" : "OUT-";
    const todayStr = formatDateForNumber(new Date(), prefix);
    const data = getAllRecords(CONFIG.SHEETS.TRANSAKSI);
    const todayRecords = data.filter(p => p.Nomor_Transaksi && p.Nomor_Transaksi.startsWith(todayStr));
    const nextNum = (todayRecords.length + 1).toString().padStart(3, '0');
    const noTransaksi = `${todayStr}-${nextNum}`;

    const record = {
      "ID_Transaksi": generateUUID("TRX"),
      "Nomor_Transaksi": noTransaksi,
      "Tanggal_Transaksi": new Date().toISOString().split('T')[0],
      "Tipe_Transaksi": tipeTransaksi, // 'Pemasukan' atau 'Pengeluaran'
      "ID_Kategori": categoryId,
      "Deskripsi": deskripsi || "-",
      "Pihak_Terkait": pihakTerkait || "-",
      "Nominal": Number(nominal),
      "Status": tipeTransaksi === "Pemasukan" ? "Disetujui" : "Pending Review",
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

    insertRecord(CONFIG.SHEETS.TRANSAKSI, record);
    logActivity(userId, "System", "Transaksi", "Create", `Mencatat ${tipeTransaksi} baru: ${noTransaksi}`);

    return respondSuccess(record, "Transaksi berhasil dicatat");
  } catch (error) {
    return respondError(error.message, "CREATE_TRANSAKSI_ERROR");
  }
}

function updateTransaksi(payload) {
  try {
    const { id, categoryId, deskripsi, pihakTerkait, nominal, userId } = payload;
    if (!id || !categoryId || !nominal) {
      return respondError("Data tidak lengkap", "INVALID_PAYLOAD");
    }

    const updates = {};
    updates["ID_Kategori"] = categoryId;
    updates["Deskripsi"] = deskripsi || "-";
    if (pihakTerkait) updates["Pihak_Terkait"] = pihakTerkait;
    updates["Nominal"] = Number(nominal);

    const success = updateRecord(CONFIG.SHEETS.TRANSAKSI, "ID_Transaksi", id, updates);
    if (!success) return respondError("Transaksi tidak ditemukan", "NOT_FOUND");

    logActivity(userId || "System", "System", "Transaksi", "Update", `Memperbarui transaksi ID: ${id}`);

    return respondSuccess({ id }, "Transaksi berhasil diperbarui");
  } catch (error) {
    return respondError(error.message, "UPDATE_TRANSAKSI_ERROR");
  }
}

function deleteTransaksi(payload) {
  try {
    const { id, userId } = payload;
    if (!id) return respondError("ID tidak ditemukan", "INVALID_PAYLOAD");

    const success = deleteRecord(CONFIG.SHEETS.TRANSAKSI, "ID_Transaksi", id);
    if (!success) return respondError("Transaksi tidak ditemukan", "NOT_FOUND");

    logActivity(userId || "System", "System", "Transaksi", "Delete", `Menghapus transaksi ID: ${id}`);

    return respondSuccess({ id }, "Transaksi berhasil dihapus");
  } catch (error) {
    return respondError(error.message, "DELETE_TRANSAKSI_ERROR");
  }
}
