/**
 * HELPERS
 * Fungsi-fungsi bantuan umum untuk response, query DB, dan utils
 */

// Format Response API
function respondSuccess(data, message = "Berhasil") {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: data,
    message: message,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function respondError(message, code = "INTERNAL_ERROR") {
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: {
      code: code,
      message: message
    },
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Format Tanggal
function formatDateForNumber(date, prefix = "") {
  let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return prefix + year + month + day;
}

// Database Helpers (Spreadsheet)
function getDb() {
  if (CONFIG.SPREADSHEET_ID === "GANTI_DENGAN_SPREADSHEET_ID_ANDA") {
    throw new Error("SPREADSHEET_ID belum dikonfigurasi di Config.gs");
  }
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}

function getSheet(sheetName) {
  return getDb().getSheetByName(sheetName);
}

// Mengubah range data array (dari Sheet) menjadi Array of JSON Objects
function sheetDataToJson(data) {
  if (!data || data.length < 2) return [];
  const headers = data[0];
  const rows = data.slice(1);
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

// Get all records from a sheet
function getAllRecords(sheetName) {
  const sheet = getSheet(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  return sheetDataToJson(data);
}

// Insert new row
function insertRecord(sheetName, recordObj) {
  const sheet = getSheet(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = headers.map(header => recordObj[header] !== undefined ? recordObj[header] : "");
  sheet.appendRow(newRow);
  return true;
}

// Audit Log Helper
function logActivity(userId, userName, modul, aktivitas, keterangan, ipAddress = "0.0.0.0") {
  const logRecord = {
    "ID_Log": generateUUID(),
    "ID_Pengguna": userId,
    "Nama_Pengguna": userName,
    "Modul": modul,
    "Aktivitas": aktivitas,
    "Keterangan": typeof keterangan === 'object' ? JSON.stringify(keterangan) : keterangan,
    "IP_Address": ipAddress,
    "Waktu": new Date().toISOString()
  };
  insertRecord(CONFIG.SHEETS.LOG_AKTIVITAS, logRecord);
}
