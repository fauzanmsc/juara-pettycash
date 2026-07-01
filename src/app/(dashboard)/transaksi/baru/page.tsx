"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { fetchGAS } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, Receipt, ArrowLeftRight } from "lucide-react";
import Link from "next/link";

export default function CatatTransaksiPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as any;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipeTransaksi: "Pengeluaran",
    deskripsi: "",
    categoryId: "",
    pihakTerkait: "",
    nominal: "",
  });

  const { data: catResponse } = useQuery({
    queryKey: ['kategori_list'],
    queryFn: () => fetchGAS('get_kategori', 'GET'),
  });
  
  const categories = catResponse?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.nominal || !formData.deskripsi) {
      toast.error("Mohon lengkapi data wajib (Tipe, Kategori, Deskripsi, Nominal)");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        userId: user?.id,
        tipeTransaksi: formData.tipeTransaksi,
        categoryId: formData.categoryId,
        deskripsi: formData.deskripsi,
        pihakTerkait: formData.pihakTerkait,
        nominal: Number(formData.nominal),
      };

      await fetchGAS('create_transaksi', 'POST', payload);
      toast.success("Transaksi berhasil dicatat!");
      router.push("/transaksi");
    } catch (err: any) {
      toast.error(err.message || "Gagal mencatat transaksi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/transaksi">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-primary" />
            Catat Transaksi
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Tambahkan data pemasukan atau pengeluaran baru</p>
        </div>
      </div>

      <Card className="p-6 md:p-8 rounded-3xl border-slate-200 dark:border-white/5 shadow-xl bg-white/70 dark:bg-[#0A120A]/70 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-4">
            <Label className="text-base font-semibold text-slate-900 dark:text-white">Jenis Transaksi</Label>
            <RadioGroup 
              value={formData.tipeTransaksi} 
              onValueChange={(val) => setFormData(prev => ({ ...prev, tipeTransaksi: val }))}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Pemasukan" id="pemasukan" />
                <Label htmlFor="pemasukan" className="text-emerald-600 dark:text-emerald-400 font-medium cursor-pointer">Pemasukan (Uang Masuk)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Pengeluaran" id="pengeluaran" />
                <Label htmlFor="pengeluaran" className="text-rose-600 dark:text-rose-400 font-medium cursor-pointer">Pengeluaran (Uang Keluar)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Kategori <span className="text-rose-500">*</span>
              </Label>
              <Select value={formData.categoryId} onValueChange={(val) => setFormData(prev => ({ ...prev, categoryId: val }))}>
                <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-black/50">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.ID_Kategori} value={cat.ID_Kategori}>{cat.Nama_Kategori}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Pihak Terkait (Vendor / Sumber)
              </Label>
              <Input 
                placeholder="Contoh: Toko ATK Sejahtera / Bank BCA"
                value={formData.pihakTerkait}
                onChange={(e) => setFormData(prev => ({ ...prev, pihakTerkait: e.target.value }))}
                className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-black/50"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Deskripsi <span className="text-rose-500">*</span>
            </Label>
            <Textarea 
              placeholder="Rincian transaksi..."
              value={formData.deskripsi}
              onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
              className="min-h-[100px] rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-black/50 resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Nominal (Rp) <span className="text-rose-500">*</span>
            </Label>
            <Input 
              type="number"
              min="0"
              placeholder="0"
              value={formData.nominal}
              onChange={(e) => setFormData(prev => ({ ...prev, nominal: e.target.value }))}
              className="h-14 text-lg font-bold rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-black/50"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Link href="/transaksi">
              <Button type="button" variant="ghost" className="h-12 px-6 rounded-xl font-medium">Batal</Button>
            </Link>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Menyimpan...</>
              ) : (
                <><Save className="w-5 h-5 mr-2" /> Simpan Transaksi</>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
