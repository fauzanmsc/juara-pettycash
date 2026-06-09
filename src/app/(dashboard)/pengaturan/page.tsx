"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Bell, Shield, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PengaturanPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  
  const [activeTab, setActiveTab] = useState("profil");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Profil berhasil diperbarui!");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-[#151921] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Pengaturan Sistem</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Kelola preferensi akun dan konfigurasi aplikasi</p>
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
            <Card className="bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800/60 soft-shadow rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800/60 pb-4">Informasi Pribadi</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-semibold">Nama Lengkap</Label>
                  <Input 
                    id="name" 
                    defaultValue={user?.name || ""} 
                    className="h-11 bg-slate-50 dark:bg-[#0D0F14] border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus-visible:ring-primary shadow-sm" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold">Alamat Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={user?.email || ""} 
                    className="h-11 bg-slate-50 dark:bg-[#0D0F14] border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus-visible:ring-primary shadow-sm" 
                  />
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
            <Card className="bg-slate-50/50 dark:bg-[#151921] border border-dashed border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center h-64 shadow-none">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Pengaturan Notifikasi belum tersedia</p>
            </Card>
          )}

          {activeTab === "sistem" && (
            <Card className="bg-slate-50/50 dark:bg-[#151921] border border-dashed border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center h-64 shadow-none">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Akses Ditolak</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Membutuhkan hak akses Super Admin</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
