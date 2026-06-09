"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { fetchGAS } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, UploadCloud, Loader2 } from "lucide-react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Anda harus login untuk mencatat pengeluaran.");

    setIsLoading(true);
    
    try {
      const payload = {
        userId: user.id || "US-000",
        categoryId: formData.category,
        deskripsi: formData.desc,
        vendor: formData.vendor,
        nominal: formData.amount
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
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 bg-white dark:bg-[#151921] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
        <Link href="/pengeluaran">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Catat Pengeluaran Baru</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Isi detail transaksi pengeluaran kas kecil</p>
        </div>
      </div>

      <Card className="bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800/60 soft-shadow rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-slate-700 dark:text-slate-300 font-semibold">Kategori Pengeluaran <span className="text-red-500">*</span></Label>
              <select 
                id="category" 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-slate-700 dark:bg-[#0D0F14] dark:text-slate-50 transition-all shadow-sm"
                required
              >
                <option value="">Pilih Kategori...</option>
                <option value="KAT-001">Alat Tulis Kantor (ATK)</option>
                <option value="KAT-002">Konsumsi / Rapat</option>
                <option value="KAT-003">Transportasi / Bensin</option>
                <option value="KAT-004">Operasional Lainnya</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vendor" className="text-slate-700 dark:text-slate-300 font-semibold">Vendor / Toko / Penerima</Label>
              <Input 
                id="vendor" 
                type="text" 
                placeholder="Contoh: Toko Buku Gramedia" 
                value={formData.vendor}
                onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                className="h-11 bg-slate-50 dark:bg-[#0D0F14] border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl shadow-sm focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300 font-semibold">Nominal Aktual (Rp) <span className="text-red-500">*</span></Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="Contoh: 120000" 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
                className="h-11 bg-slate-50 dark:bg-[#0D0F14] border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl shadow-sm focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc" className="text-slate-700 dark:text-slate-300 font-semibold">Keterangan Barang / Jasa <span className="text-red-500">*</span></Label>
            <Textarea 
              id="desc" 
              placeholder="Jelaskan detail barang atau jasa yang dibeli..." 
              value={formData.desc}
              onChange={(e) => setFormData({...formData, desc: e.target.value})}
              required
              className="min-h-[120px] bg-slate-50 dark:bg-[#0D0F14] border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl shadow-sm focus-visible:ring-primary p-4"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300 font-semibold">Lampiran Nota / Kwitansi (Opsional)</Label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-[#0D0F14]/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform border border-slate-100 dark:border-slate-700">
                <UploadCloud className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Klik untuk unggah nota bukti transaksi</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">JPG, PNG, atau PDF (Maks. 5MB)</p>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800/60">
            <Link href="/pengeluaran">
              <Button type="button" variant="ghost" className="text-slate-600 dark:text-slate-400 h-11 rounded-xl px-6 hover:bg-slate-100 dark:hover:bg-slate-800">
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading} className="h-11 rounded-xl px-8 bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-all">
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
