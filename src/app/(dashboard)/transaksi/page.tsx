"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchGAS } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";
import { Search, ArrowLeftRight, Plus, Filter, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { formatRp } from "@/lib/utils";

export default function TransaksiPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [tipeFilter, setTipeFilter] = useState("Semua");
  const [sortBy, setSortBy] = useState("Terbaru");

  // Modal States
  const [deleteData, setDeleteData] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: response, isLoading: isTransaksiLoading } = useQuery({
    queryKey: ['transaksi_list'],
    queryFn: () => fetchGAS('get_transaksi', 'GET'),
  });

  const { data: catResponse, isLoading: isKategoriLoading } = useQuery({
    queryKey: ['kategori_list'],
    queryFn: () => fetchGAS('get_kategori', 'GET'),
  });

  const isLoading = isTransaksiLoading || isKategoriLoading;

  const transaksiData = response?.data || [];
  const categories = catResponse?.data || [];
  
  const categoryMap = new Map();
  categories.forEach((cat: any) => {
    categoryMap.set(cat.ID_Kategori, cat);
  });

  let filteredData = transaksiData.filter((item: any) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = item.Nomor_Transaksi?.toLowerCase().includes(searchLower) ||
      item.Deskripsi?.toLowerCase().includes(searchLower) ||
      item.Pihak_Terkait?.toLowerCase().includes(searchLower);
    
    const matchesTipe = tipeFilter === "Semua" || item.Tipe_Transaksi === tipeFilter;
    
    return matchesSearch && matchesTipe;
  });

  filteredData.sort((a: any, b: any) => {
    if (sortBy === "Terbaru") return new Date(b.Tanggal_Dibuat).getTime() - new Date(a.Tanggal_Dibuat).getTime();
    if (sortBy === "Terlama") return new Date(a.Tanggal_Dibuat).getTime() - new Date(b.Tanggal_Dibuat).getTime();
    if (sortBy === "Terbesar") return Number(b.Nominal) - Number(a.Nominal);
    if (sortBy === "Terkecil") return Number(a.Nominal) - Number(b.Nominal);
    return 0;
  });

  // Action Handlers
  const handleDeleteClick = (row: any) => {
    setDeleteData(row);
  };

  const handleConfirmDelete = async () => {
    if (!deleteData) return;
    setIsDeleting(true);
    try {
      await fetchGAS('delete_transaksi', 'POST', {
        id: deleteData.ID_Transaksi,
        userId: user?.id,
      });
      toast.success("Transaksi berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ['transaksi_list'] });
      setDeleteData(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus transaksi");
    } finally {
      setIsDeleting(false);
    }
  };

  const IconComponent = ({ name, color }: { name: string, color: string }) => {
    const LucideIcon = (LucideIcons as any)[name];
    if (!LucideIcon) return <LucideIcons.Circle style={{ color }} className="w-5 h-5" />;
    return <LucideIcon style={{ color }} className="w-5 h-5" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <ArrowLeftRight className="w-8 h-8 text-primary" />
            Transaksi Kas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Kelola data Pemasukan dan Pengeluaran kas.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari transaksi..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070D07]"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto h-11 rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                {tipeFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuRadioGroup value={tipeFilter} onValueChange={setTipeFilter}>
                <DropdownMenuRadioItem value="Semua">Semua Tipe</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Pemasukan">Pemasukan</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Pengeluaran">Pengeluaran</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto h-11 rounded-xl">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="Terbaru">Terbaru</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Terlama">Terlama</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Terbesar">Nominal Terbesar</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Terkecil">Nominal Terkecil</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/transaksi/baru" className="w-full sm:w-auto">
            <Button className="w-full h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg transition-all border-0">
              <Plus className="w-5 h-5 mr-2" />
              Catat Transaksi
            </Button>
          </Link>
        </div>
      </div>

      <Card className="rounded-3xl border-slate-200 dark:border-white/5 bg-white/70 dark:bg-[#0A120A] overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/80 dark:bg-[#0D180D] border-b border-slate-200 dark:border-white/5">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold py-5 px-6">Tipe</TableHead>
                <TableHead className="font-bold">Tanggal</TableHead>
                <TableHead className="font-bold">Keterangan / Kategori</TableHead>
                <TableHead className="font-bold">Pihak Terkait</TableHead>
                <TableHead className="font-bold text-right">Nominal</TableHead>
                <TableHead className="font-bold text-right px-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-500">Memuat data...</TableCell>
                </TableRow>
              ) : filteredData.length > 0 ? (
                filteredData.map((row: any) => {
                  const cat = categoryMap.get(row.ID_Kategori);
                  const isPemasukan = row.Tipe_Transaksi === "Pemasukan";
                  
                  return (
                    <TableRow key={row.ID_Transaksi} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                      <TableCell className="px-6 py-4">
                        <Badge className={cn("px-3 py-1 rounded-full font-bold", isPemasukan ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800")}>
                          {row.Tipe_Transaksi}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-slate-600 dark:text-slate-400">
                        {new Date(row.Tanggal_Transaksi).toLocaleDateString('id-ID')}
                        <div className="text-xs mt-1 text-slate-400">{row.Nomor_Transaksi}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                             <IconComponent name={cat?.Icon || "Circle"} color={cat?.Warna_Hex || "#64748b"} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{row.Deskripsi}</p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                              {cat?.Nama_Kategori || "Tidak ada kategori"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-600 dark:text-slate-300">
                        {row.Pihak_Terkait}
                      </TableCell>
                      <TableCell className={cn("font-bold text-right", isPemasukan ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                        {isPemasukan ? "+" : "-"}{formatRp(row.Nominal)}
                      </TableCell>
                      <TableCell className="text-right px-6">
                         <div className="flex items-center justify-end gap-2">
                           {/* Simplified actions, can add edit later */}
                           <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(row)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl px-3 h-9">
                             Hapus
                           </Button>
                         </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center">
                        <ArrowLeftRight className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Tidak ada transaksi ditemukan</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!deleteData} onOpenChange={(open) => !open && setDeleteData(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Hapus Transaksi</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus transaksi <strong className="text-slate-900 dark:text-white">{deleteData?.Deskripsi}</strong> ({formatRp(deleteData?.Nominal || 0)})?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setDeleteData(null)} disabled={isDeleting} className="rounded-xl">Batal</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting} className="rounded-xl">
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
