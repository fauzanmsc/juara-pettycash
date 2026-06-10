/**
 * PENGAJUAN CONTROLLER
 * Menangani pembuatan, pembacaan, dan update pengajuan dana
 */

function getPengajuanList(userId, role) {
  try {
    const data = getAllRecords(CONFIG.SHEETS.PENGAJUAN);
    
    // Jika role bukan admin/manager/direktur, hanya lihat pengajuan sendiri
    if (role !== 'admin_finance' && role !== 'head_manager' && role !== 'direktur') {
      const filtered = data.filter(p => p.ID_Pemohon === userId);
      return respondSuccess(filtered);
    }
    
    return respondSuccess(data);
  } catch (error) {
    return respondError(error.message, "GET_PENGAJUAN_ERROR");
  }
}

function createPengajuan(payload) {
  try {
    const { userId, divisi, categoryId, keperluan, nominal } = payload;
    
    // Validasi payload
    if (!userId || !categoryId || !keperluan || !nominal) {
      return respondError("Data tidak lengkap", "INVALID_PAYLOAD");
    }

    // Nomor Pengajuan PJD-YYYYMMDD-XXX
    const todayStr = formatDateForNumber(new Date(), "PJD-");
    const data = getAllRecords(CONFIG.SHEETS.PENGAJUAN);
    const todayRecords = data.filter(p => p.Nomor_Pengajuan && p.Nomor_Pengajuan.startsWith(todayStr));
    const nextNum = (todayRecords.length + 1).toString().padStart(3, '0');
    const noPengajuan = `${todayStr}-${nextNum}`;
    
    // Logika Status Awal
    // Sesuai PRD: Jika nominal > Limit HM -> Pending Direktur, else Pending HM
    let statusAwal = "Pending HM";
    if (Number(nominal) > CONFIG.DEFAULTS.LIMIT_PERSETUJUAN_HM) {
      statusAwal = "Pending HM"; // Biasanya berjenjang, HM dulu baru Direktur, kita set ke HM dulu
    }

    const record = {
      "ID_Pengajuan": generateUUID("REQ"),
      "Nomor_Pengajuan": noPengajuan,
      "Tanggal_Pengajuan": new Date().toISOString().split('T')[0],
      "ID_Pemohon": userId,
      "Divisi": divisi || "-",
      "ID_Kategori": categoryId,
      "Keperluan": keperluan,
      "Nominal_Pengajuan": Number(nominal),
      "Status": statusAwal,
      "Catatan_Approval": "",
      "Tanggal_Dibuat": new Date().toISOString(),
      "Tanggal_Diupdate": new Date().toISOString()
    };

    insertRecord(CONFIG.SHEETS.PENGAJUAN, record);
    logActivity(userId, "System", "Pengajuan", "Create", `Membuat pengajuan baru: ${noPengajuan}`);

    return respondSuccess(record, "Pengajuan berhasil dibuat");
  } catch (error) {
    return respondError(error.message, "CREATE_PENGAJUAN_ERROR");
  }
}

function updatePengajuanStatus(payload) {
  try {
    const { id, status, userId } = payload;
    if (!id || !status) {
      return createErrorResponse("ID dan Status wajib diisi", 400);
    }
    
    const records = getAllRecords(CONFIG.SHEETS.PENGAJUAN);
    const index = records.findIndex(r => r.ID_Pengajuan === id);
    
    if (index === -1) {
      return createErrorResponse("Data pengajuan tidak ditemukan", 404);
    }
    
    // Update the row (adding 2 to index to account for header and 0-based index)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.PENGAJUAN);
    // Let's find the column index for "Status"
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const statusColIndex = headers.indexOf("Status") + 1;
    
    if (statusColIndex > 0) {
      sheet.getRange(index + 2, statusColIndex).setValue(status);
      
      // Log Activity
      logActivity(
        userId || "SISTEM",
        "Approval",
        `Mengubah status pengajuan ${id} menjadi ${status}`
      );
      
      return createSuccessResponse(null, `Status pengajuan ${id} berhasil diperbarui menjadi ${status}`);
    } else {
      return createErrorResponse("Kolom Status tidak ditemukan di sheet", 500);
    }
  } catch (error) {
    return createErrorResponse("Gagal memperbarui status: " + error.toString(), 500);
  }
}
