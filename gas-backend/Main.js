/**
 * MAIN ENTRY POINT (API ROUTER)
 * File ini menangani request GET dan POST dari aplikasi Next.js (Frontend)
 */

// Menangani Preflight OPTIONS (CORS)
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Endpoint GET
 * Biasanya digunakan untuk mengambil data (Read)
 * Query Params: ?action=namaAksi&userId=123
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const userId = e.parameter.userId;
    const role = e.parameter.role;

    switch (action) {
      case "setup_db":
        setupDatabase();
        return respondSuccess(null, "Database setup selesai");

      case "seed_db":
        generateDummyData();
        return respondSuccess(null, "Dummy data generated");

      case "get_profile":
        return getUserProfile(userId);

      case "get_dashboard":
        return getDashboardStats(userId, role);

      case "get_chart":
        return getChartData();

      case "get_pengajuan":
        return getPengajuanList(userId, role);

      case "get_pengeluaran":
        return getPengeluaranList();

      case "get_settlement":
        return getSettlementList();

      case "get_replenishment":
        return getReplenishmentList();

      case "get_kategori":
        return getKategori();

      case "get_logs":
        return respondSuccess(getAllRecords(CONFIG.SHEETS.LOG_AKTIVITAS));

      default:
        return respondError("Action GET tidak ditemukan", "INVALID_ACTION");
    }
  } catch (error) {
    return respondError(error.toString(), "FATAL_ERROR");
  }
}

/**
 * Endpoint POST
 * Digunakan untuk mengirim data JSON (Create, Update, Delete)
 */
function doPost(e) {
  try {
    // GAS POST body text
    const payloadString = e.postData.contents;
    const payload = JSON.parse(payloadString);
    const action = payload.action;

    switch (action) {
      case "login":
        return validateUser(payload.email, payload.password);

      case "create_pengajuan":
        return createPengajuan(payload);

      case "create_pengeluaran":
        return createPengeluaran(payload);

      case "create_settlement":
        return createSettlement(payload);

      case "create_replenishment":
        return createReplenishment(payload);

      case "create_kategori":
        return createKategori(payload);

      case "update_kategori":
        return updateKategori(payload);

      case "delete_kategori":
        return deleteKategori(payload);

      default:
        return respondError("Action POST tidak ditemukan", "INVALID_ACTION");
    }
  } catch (error) {
    return respondError(error.toString(), "FATAL_ERROR");
  }
}
