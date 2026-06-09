/**
 * KATEGORI CONTROLLER
 * Menangani CRUD untuk master data Kategori Pengeluaran
 */

function getKategori() {
  try {
    const data = getAllRecords(CONFIG.SHEETS.KATEGORI);
    return respondSuccess(data);
  } catch (error) {
    return respondError(error.message, "GET_KATEGORI_ERROR");
  }
}

function createKategori(payload) {
  try {
    const { Nama_Kategori, Keterangan } = payload;
    if (!Nama_Kategori) {
      return respondError("Nama Kategori wajib diisi", "VALIDATION_ERROR");
    }

    const record = {
      "ID_Kategori": generateUUID("KAT"),
      "Nama_Kategori": Nama_Kategori,
      "Keterangan": Keterangan || "-",
      "Status": "Aktif"
    };

    insertRecord(CONFIG.SHEETS.KATEGORI, record);
    return respondSuccess({ id: record.ID_Kategori }, "Kategori berhasil ditambahkan");
  } catch (error) {
    return respondError(error.message, "CREATE_KATEGORI_ERROR");
  }
}

function updateKategori(payload) {
  try {
    const { id, Nama_Kategori, Keterangan, Status } = payload;
    if (!id) {
      return respondError("ID Kategori wajib disertakan", "VALIDATION_ERROR");
    }

    const updates = {};
    if (Nama_Kategori !== undefined) updates.Nama_Kategori = Nama_Kategori;
    if (Keterangan !== undefined) updates.Keterangan = Keterangan;
    if (Status !== undefined) updates.Status = Status;

    const success = updateRecord(CONFIG.SHEETS.KATEGORI, "ID_Kategori", id, updates);
    
    if (success) {
      return respondSuccess({ id }, "Kategori berhasil diperbarui");
    } else {
      return respondError("Kategori tidak ditemukan", "NOT_FOUND");
    }
  } catch (error) {
    return respondError(error.message, "UPDATE_KATEGORI_ERROR");
  }
}

function deleteKategori(payload) {
  try {
    const { id } = payload;
    if (!id) {
      return respondError("ID Kategori wajib disertakan", "VALIDATION_ERROR");
    }

    const success = deleteRecord(CONFIG.SHEETS.KATEGORI, "ID_Kategori", id);
    
    if (success) {
      return respondSuccess({ id }, "Kategori berhasil dihapus");
    } else {
      return respondError("Kategori tidak ditemukan", "NOT_FOUND");
    }
  } catch (error) {
    return respondError(error.message, "DELETE_KATEGORI_ERROR");
  }
}
