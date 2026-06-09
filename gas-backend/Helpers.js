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

// Generate Simple ID (Format: PREFIX-MMYY-XXX)
function generateUUID(prefix = "ID") {
  const date = new Date();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < 3; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return prefix + '-' + mm + yy + '-' + randomStr;
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

// Update record by Key
function updateRecord(sheetName, keyField, keyValue, updateObj) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const keyIndex = headers.indexOf(keyField);
  
  if (keyIndex === -1) return false;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][keyIndex] === keyValue) {
      for (const [key, value] of Object.entries(updateObj)) {
        const colIndex = headers.indexOf(key);
        if (colIndex !== -1) {
          sheet.getRange(i + 1, colIndex + 1).setValue(value);
        }
      }
      return true;
    }
  }
  return false;
}

// Delete record by Key
function deleteRecord(sheetName, keyField, keyValue) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const keyIndex = headers.indexOf(keyField);
  
  if (keyIndex === -1) return false;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][keyIndex] === keyValue) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

// Audit Log Helper
function logActivity(userId, userName, modul, aktivitas, keterangan, ipAddress = "0.0.0.0") {
  const logRecord = {
    "ID_Log": generateUUID("LOG"),
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
