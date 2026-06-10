"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchGAS } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Bell, Shield, Save, Loader2, Eye, EyeOff, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PengaturanPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  
  const { update } = useSession();
  const [activeTab, setActiveTab] = useState("profil");
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile State
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatar, setAvatar] = useState(user?.image || "/images/default-avatar.png");
  
  // System State
  const [sysLoading, setSysLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    if (activeTab === "sistem" && !settings) {
      setSysLoading(true);
      fetchGAS("get_settings", "GET").then((res) => {
        if (res.status === "success") {
          setSettings(res.data);
        }
        setSysLoading(false);
      });
    }
  }, [activeTab, settings]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 2MB!");
      return;
    }
    
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        id: user?.id,
        name,
        email,
        password: password ? password : undefined,
        avatar
      };
      const res = await fetchGAS("update_profile", "POST", payload);
      if (res.status === "success") {
        // Use the new Google Drive URL returned by the backend, or fallback to avatar
        const finalAvatarUrl = res.data?.avatarUrl || avatar;
        await update({ name, email, image: finalAvatarUrl });
        toast.success("Profil berhasil diperbarui!");
        setPassword("");
      } else {
        toast.error(res.message || "Gagal memperbarui profil");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem saat memperbarui profil.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        userId: user?.id,
        ...settings
      };
      const res = await fetchGAS("update_settings", "POST", payload);
      if (res.status === "success") {
        toast.success("Pengaturan sistem berhasil disimpan!");
      } else {
        toast.error(res.message || "Gagal memperbarui sistem");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profil berhasil diperbarui!");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] p-6 rounded-2xl border border-slate-200  shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Pengaturan Sistem</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Atur profil Anda dan sesuaikan sistem operasi kas kecil.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab("profil")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all",
              activeTab === "profil"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50"
            )}
          >
            <User className="w-5 h-5" />
            Profil Pengguna
          </button>
          
          <button
            onClick={() => setActiveTab("notifikasi")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all",
              activeTab === "notifikasi"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50"
            )}
          >
            <Bell className="w-5 h-5" />
            Notifikasi
          </button>

          <button
            onClick={() => setActiveTab("sistem")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all",
              activeTab === "sistem"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50"
            )}
          >
            <Shield className="w-5 h-5" />
            Konfigurasi Sistem
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "profil" && (
            <Card className="bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-slate-200  soft-shadow rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-white/5  pb-4">Data Diri</h2>
              
              <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-lg">
                                <div className="space-y-3 pb-4">
                  <Label className="text-slate-700 dark:text-slate-300 font-semibold">Foto Profil</Label>
                  <div className="flex items-center gap-6">
                    <div className="relative w-20 h-20 rounded-full border-2 border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                      {avatar ? (
                        <img src={avatar} className="w-full h-full object-cover" alt="Avatar Preview" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-slate-400">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="avatar-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
                        <Upload className="w-4 h-4 text-primary" />
                        Unggah Foto
                      </Label>
                      <Input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/jpeg, image/png, image/webp" 
                        className="hidden" 
                        onChange={handleAvatarChange}
                      />
                      <p className="text-xs text-slate-500">Format: JPG, PNG. Maksimal 2MB.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-semibold">Nama Lengkap</Label>
                  <Input 
                    id="name" 
                    value={name} onChange={(e) => setName(e.target.value)} 
                    className="h-11 bg-slate-50 dark:bg-[#070D07] border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus-visible:ring-primary shadow-sm" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold">Alamat Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} onChange={(e) => setEmail(e.target.value)} 
                    className="h-11 bg-slate-50 dark:bg-[#070D07] border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus-visible:ring-primary shadow-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold">Password Baru</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Kosongkan jika tidak ingin diubah"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 bg-slate-50 dark:bg-[#070D07] border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus-visible:ring-primary shadow-sm pr-12" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-700 dark:text-slate-300 font-semibold">Divisi / Jabatan</Label>
                  <Input 
                    id="role" 
                    defaultValue={user?.role || "Karyawan"} 
                    disabled 
                    className="h-11 bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed rounded-xl" 
                  />
                  <p className="text-xs text-slate-500 font-medium pt-1">Hubungi IT Support untuk mengubah divisi atau peran Anda.</p>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isLoading} className="h-11 px-8 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-all">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === "notifikasi" && (
            <Card className="bg-slate-50/50 dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border border-dashed border-slate-200  rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center h-64 shadow-none">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Pengaturan Notifikasi belum tersedia</p>
            </Card>
          )}

          {activeTab === "sistem" && (
            <Card className="bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-slate-200  soft-shadow rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-white/5  pb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Konfigurasi Sistem
              </h2>
              {sysLoading ? (
                 <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : settings ? (
                <form onSubmit={handleSystemSubmit} className="space-y-6 max-w-lg">
                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300 font-semibold">Nama Perusahaan</Label>
                    <Input 
                      value={settings.NAMA_PERUSAHAAN || ""} 
                      onChange={(e) => setSettings({...settings, NAMA_PERUSAHAAN: e.target.value})}
                      className="h-11 bg-slate-50 dark:bg-[#070D07] rounded-xl" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300 font-semibold">Saldo Minimum Kas Kecil (Rp)</Label>
                    <Input 
                      type="number"
                      value={settings.SALDO_MINIMUM || ""} 
                      onChange={(e) => setSettings({...settings, SALDO_MINIMUM: Number(e.target.value)})}
                      className="h-11 bg-slate-50 dark:bg-[#070D07] rounded-xl" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300 font-semibold">Limit Persetujuan Head Manager (Rp)</Label>
                    <Input 
                      type="number"
                      value={settings.LIMIT_PERSETUJUAN_HM || ""} 
                      onChange={(e) => setSettings({...settings, LIMIT_PERSETUJUAN_HM: Number(e.target.value)})}
                      className="h-11 bg-slate-50 dark:bg-[#070D07] rounded-xl" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300 font-semibold">Limit Persetujuan Direktur (Rp)</Label>
                    <Input 
                      type="number"
                      value={settings.LIMIT_PERSETUJUAN_DIREKTUR || ""} 
                      onChange={(e) => setSettings({...settings, LIMIT_PERSETUJUAN_DIREKTUR: Number(e.target.value)})}
                      className="h-11 bg-slate-50 dark:bg-[#070D07] rounded-xl" 
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" disabled={isLoading} className="h-11 px-8 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-all">
                      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Simpan Konfigurasi
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-red-500">Gagal memuat pengaturan.</div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
