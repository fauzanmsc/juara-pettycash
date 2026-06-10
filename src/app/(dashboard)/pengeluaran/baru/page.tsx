"use client";

import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { fetchGAS } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, UploadCloud, Loader2, X, File as FileIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BaruPengeluaranPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as any;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    vendor: "",
    amount: "",
    desc: ""
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (f.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }
      setFile(f);
      if (f.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(f);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Anda harus login untuk mencatat pengeluaran.");

    setIsLoading(true);
    
    try {
      let fileData = "";
      let fileName = "";
      let fileMimeType = "";
      
      if (file) {
        const reader = new FileReader();
        const base64Promise = new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
        fileData = (await base64Promise) as string;
        fileName = file.name;
        fileMimeType = file.type;
      }

      const payload = {
        userId: user.id || "US-000",
        categoryId: formData.category,
        deskripsi: formData.desc,
        vendor: formData.vendor,
        nominal: formData.amount,
        fileData,
        fileName,
        fileMimeType
      };

      const res = await fetchGAS('create_pengeluaran', 'POST', payload);
      
      if (res.status === 'success') {
        router.push("/pengeluaran");
        router.refresh();
      } else {
        alert("Gagal mencatat pengeluaran: " + res.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menghubungi server.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] w-full max-w-6xl mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/pengeluaran">
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">Catat Pengeluaran Baru</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Isi detail transaksi pengeluaran kas kecil</p>
        </div>
      </div>

      <Card className="flex-1 bg-white/60 dark:bg-white/5 backdrop-blur-xl dark:border-white/10 border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 overflow-y-auto">
          <div className="flex flex-col lg:flex-row gap-8 flex-1">
            {/* Kiri: Form Data */}
            <div className="flex-1 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Kategori <span className="text-red-500">*</span></Label>
                  <select 
                    id="category" 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-slate-700 dark:bg-black/20 dark:text-slate-50 transition-all shadow-sm"
                    required
                  >
                    <option value="">Pilih Kategori...</option>
                    <option value="KAT-001">Alat Tulis Kantor (ATK)</option>
                    <option value="KAT-002">Konsumsi / Rapat</option>
                    <option value="KAT-003">Transportasi / Bensin</option>
                    <option value="KAT-004">Operasional Lainnya</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="vendor" className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Vendor / Toko</Label>
                  <Input 
                    id="vendor" 
                    type="text" 
                    placeholder="Contoh: Toko Buku Gramedia" 
                    value={formData.vendor}
                    onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                    className="h-10 bg-white dark:bg-black/20 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl shadow-sm focus-visible:ring-primary text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Nominal (Rp) <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">Rp</span>
                  </div>
                  <Input 
                    id="amount" 
                    type="text" 
                    placeholder="0" 
                    value={formData.amount ? new Intl.NumberFormat('id-ID').format(Number(formData.amount)) : ""}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      setFormData({...formData, amount: rawValue});
                    }}
                    required
                    className="h-12 pl-10 bg-white dark:bg-black/20 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl shadow-sm focus-visible:ring-primary font-bold text-lg"
                  />
                </div>
              </div>

              <div className="space-y-1.5 flex-1 flex flex-col">
                <Label htmlFor="desc" className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Keterangan Jasa / Barang <span className="text-red-500">*</span></Label>
                <Textarea 
                  id="desc" 
                  placeholder="Jelaskan detail barang atau jasa yang dibeli..." 
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
                  required
                  className="flex-1 min-h-[100px] resize-none bg-white dark:bg-black/20 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl shadow-sm focus-visible:ring-primary p-3 text-sm"
                />
              </div>
            </div>

            {/* Kanan: Upload Nota */}
            <div className="flex-1 flex flex-col space-y-1.5 h-full">
              <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Lampiran Nota (Opsional)</Label>
              <div 
                className="flex-1 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-black/20 hover:bg-slate-100 dark:hover:bg-black/40 transition-colors cursor-pointer group relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/jpeg,image/png,application/pdf" 
                  className="hidden" 
                />
                {file ? (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    {preview ? (
                      <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                        <FileIcon className="w-8 h-8" />
                      </div>
                    )}
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      className="mt-4 h-8 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      <X className="w-3 h-3 mr-1" /> Hapus File
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform border border-slate-100 dark:border-white/5 dark:border-slate-700">
                      <UploadCloud className="w-7 h-7 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Unggah Nota Bukti Transaksi</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Seret & lepas atau klik untuk memilih file</p>
                    <div className="mt-4 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">JPG, PNG, PDF (Maks 5MB)</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-5 mt-5 flex justify-end gap-3 border-t border-slate-100 dark:border-white/5">
            <Link href="/pengeluaran">
              <Button type="button" variant="ghost" className="text-slate-600 dark:text-slate-400 h-10 rounded-xl px-6 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm">
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading} className="h-10 rounded-xl px-8 bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-all text-sm font-semibold">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Transaksi
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
