/**
 * SETTLEMENT & REPLENISHMENT CONTROLLERS
 * Menangani rekonsiliasi pengajuan dana (Settlement) dan pengisian kembali kas kecil
 */

function createSettlement(payload) {
  try {
    const { userId, idPengajuan, danaDiterima, details } = payload; // details = array of {idKategori, deskripsi, nominal}
    
    if (!idPengajuan || !details || details.length === 0) {
      return respondError("Data tidak lengkap", "INVALID_PAYLOAD");
    }

    const totalPengeluaran = details.reduce((sum, item) => sum + Number(item.nominal), 0);
    const selisih = Number(danaDiterima) - totalPengeluaran;

    // Nomor Settlement SET-YYYYMMDD-XXX
    const todayStr = formatDateForNumber(new Date(), "SET-");
    const data = getAllRecords(CONFIG.SHEETS.SETTLEMENT);
    const todayRecords = data.filter(p => p.Nomor_Settlement && p.Nomor_Settlement.startsWith(todayStr));
    const nextNum = (todayRecords.length + 1).toString().padStart(3, '0');
    const noSettlement = `${todayStr}-${nextNum}`;
    const idPj = generateUUID();

    const record = {
      "ID_PJ": idPj,
      "Nomor_Settlement": noSettlement,
      "ID_Pengajuan": idPengajuan,
      "Dana_Diterima": Number(danaDiterima),
      "Total_Pengeluaran": totalPengeluaran,
      "Selisih": selisih,
      "Catatan": selisih > 0 ? "Harus mengembalikan sisa dana" : (selisih < 0 ? "Perlu reimbursement tambahan" : "Sesuai"),
      "Status": "Pending Review",
      "Tanggal_Dibuat": new Date().toISOString()
    };

    insertRecord(CONFIG.SHEETS.SETTLEMENT, record);

    // Insert detail settlement
    details.forEach(det => {
      insertRecord(CONFIG.SHEETS.DETAIL_SETTLEMENT, {
        "ID_Detail": generateUUID(),
        "ID_PJ": idPj,
        "Tanggal": new Date().toISOString().split('T')[0],
        "ID_Kategori": det.idKategori,
        "Deskripsi": det.deskripsi,
        "Nominal": Number(det.nominal)
      });
    });

    logActivity(userId, "System", "Settlement", "Create", `Membuat settlement: ${noSettlement}`);

    return respondSuccess(record, "Settlement berhasil dibuat");
  } catch (error) {
    return respondError(error.message, "CREATE_SETTLEMENT_ERROR");
  }
}

function createReplenishment(payload) {
  try {
    const { userId, nominalPengisian, alasan } = payload;
    
    if (!nominalPengisian) {
      return respondError("Nominal pengisian tidak boleh kosong", "INVALID_PAYLOAD");
    }

    // Nomor Replenishment REP-YYYYMMDD-XXX
    const todayStr = formatDateForNumber(new Date(), "REP-");
    const data = getAllRecords(CONFIG.SHEETS.REPLENISHMENT);
    const todayRecords = data.filter(p => p.Nomor_Replenishment && p.Nomor_Replenishment.startsWith(todayStr));
    const nextNum = (todayRecords.length + 1).toString().padStart(3, '0');
    const noRep = `${todayStr}-${nextNum}`;

    // Ambil saldo saat ini
    const saldoData = getAllRecords(CONFIG.SHEETS.SALDO);
    const saldoSaatIni = saldoData.length > 0 ? saldoData[saldoData.length - 1].Saldo_Akhir : 0;

    const record = {
      "ID_Replenishment": generateUUID(),
      "Nomor_Replenishment": noRep,
      "Tanggal_Pengajuan": new Date().toISOString().split('T')[0],
      "Saldo_Saat_Ini": saldoSaatIni,
      "Nominal_Pengisian": Number(nominalPengisian),
      "Alasan": alasan || "-",
      "Status": "Pending Direktur", // Biasanya replenishment butuh approval direktur
      "Tanggal_Dibuat": new Date().toISOString()
    };

    insertRecord(CONFIG.SHEETS.REPLENISHMENT, record);
    logActivity(userId, "System", "Replenishment", "Create", `Mengajukan replenishment: ${noRep}`);

    return respondSuccess(record, "Replenishment berhasil diajukan");
  } catch (error) {
    return respondError(error.message, "CREATE_REPLENISHMENT_ERROR");
  }
}
