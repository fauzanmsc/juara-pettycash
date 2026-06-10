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

function updateProfile(payload) {
  try {
    const { id, name, email, password, avatar } = payload;
    
    if (!id) return respondError("ID Pengguna tidak valid", "BAD_REQUEST");
    
    const sheet = getSheet(CONFIG.SHEETS.PENGGUNA);
    const data = sheet.getDataRange().getValues();
    
    let found = false;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) { // Index 0 = ID_Pengguna
        if (name) sheet.getRange(i + 1, 2).setValue(name); // Index 1 = Nama
        if (email) sheet.getRange(i + 1, 3).setValue(email); // Index 2 = Email
        if (password) sheet.getRange(i + 1, 4).setValue(password); // Index 3 = Password
        
        if (avatar) {
          // Check if it is a new base64 upload
          if (avatar.startsWith("data:image/")) {
            try {
              const base64Data = avatar.split(",")[1];
              const mimeType = avatar.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
              const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, "avatar_" + id);
              
              // Temukan atau buat folder "Avatars"
              let folder;
              const folders = DriveApp.getFoldersByName("Avatars_PettyCash");
              if (folders.hasNext()) {
                folder = folders.next();
              } else {
                folder = DriveApp.createFolder("Avatars_PettyCash");
                folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
              }
              
              const file = folder.createFile(blob);
              file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
              const fileUrl = file.getUrl();
              
              sheet.getRange(i + 1, 11).setValue(fileUrl);
            } catch(e) {
              Logger.log("Error upload avatar: " + e);
            }
          } else {
            // Jika bukan base64 (misal string URL biasa), simpan langsung
            sheet.getRange(i + 1, 11).setValue(avatar);
          }
        }

        
        found = true;
        break;
      }
    }
    
    if (!found) {
      return respondError("User tidak ditemukan", "NOT_FOUND");
    }
    
    logActivity(id, name || id, "auth", "update_profile", "Pengguna memperbarui data profil");
    
    return respondSuccess({ message: "Profil berhasil diperbarui" });
  } catch (error) {
    return respondError("Gagal memperbarui profil: " + error.message, "INTERNAL_ERROR");
  }
}
