/**
 * AUTH CONTROLLER
 * Menangani validasi user dan pengambilan profil
 */

function validateUser(email, password) {
  const users = getAllRecords(CONFIG.SHEETS.PENGGUNA);
  const user = users.find(u => u.Email === email && u.Status === 'active');
  
  if (!user) {
    return respondError("Email tidak terdaftar atau tidak aktif", "UNAUTHORIZED");
  }

  if (user.Password !== password) {
    return respondError("Password salah", "UNAUTHORIZED");
  }

  // Update Terakhir Login
  const sheet = getSheet(CONFIG.SHEETS.PENGGUNA);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === email) { // Kolom Email (Index 2)
      sheet.getRange(i + 1, 9).setValue(new Date().toISOString()); // Kolom Terakhir_Login (Index 8 = 9)
      break;
    }
  }

  logActivity(user.ID_Pengguna, user.Nama, "auth", "login", "User berhasil login via Google OAuth");

  return respondSuccess({
    id: user.ID_Pengguna,
    name: user.Nama,
    email: user.Email,
    role: user.Peran,
    division: user.Divisi,
    position: user.Jabatan
  });
}

function getUserProfile(userId) {
  const users = getAllRecords(CONFIG.SHEETS.PENGGUNA);
  const user = users.find(u => u.ID_Pengguna === userId);
  
  if (!user) {
    return respondError("User tidak ditemukan", "NOT_FOUND");
  }

  return respondSuccess(user);
}
