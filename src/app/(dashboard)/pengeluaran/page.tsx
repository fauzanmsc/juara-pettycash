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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";
import { Search, Receipt, Plus, Filter, Paperclip, ArrowUpDown, CalendarRange } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
};

export default function PengeluaranPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [sortBy, setSortBy] = useState("Terbaru");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Modal States
  const [deleteData, setDeleteData] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit Form State
  const [editForm, setEditForm] = useState({
    deskripsi: "",
    nominal: "",
    categoryId: "",
  });

  const { data: response, isLoading: isPengeluaranLoading } = useQuery({
    queryKey: ['pengeluaran_list'],
    queryFn: () => fetchGAS('get_pengeluaran', 'GET'),
  });

  const { data: catResponse, isLoading: isKategoriLoading } = useQuery({
    queryKey: ['kategori_list'],
    queryFn: () => fetchGAS('get_kategori', 'GET'),
  });

  const isLoading = isPengeluaranLoading || isKategoriLoading;

  const pengeluaranData = response?.data || [];
  const categories = catResponse?.data || [];
  
  const categoryMap = new Map();
  categories.forEach((cat: any) => {
    categoryMap.set(cat.ID_Kategori, cat);
  });

  let filteredData = pengeluaranData.filter((item: any) => {
    const matchesSearch = item.ID_Pengeluaran?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Ref_Pengajuan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Deskripsi?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "Semua" || item.Status === statusFilter;
    
    let matchesDate = true;
    if (dateRange.start || dateRange.end) {
      const itemDate = new Date(item.Tanggal);
      if (dateRange.start && new Date(dateRange.start) > itemDate) matchesDate = false;
      if (dateRange.end && new Date(dateRange.end) < itemDate) matchesDate = false;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  filteredData.sort((a: any, b: any) => {
    if (sortBy === "Terbaru") return new Date(b.Tanggal).getTime() - new Date(a.Tanggal).getTime();
    if (sortBy === "Terlama") return new Date(a.Tanggal).getTime() - new Date(b.Tanggal).getTime();
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
      const res = await fetchGAS("delete_pengeluaran", "POST", { id: deleteData.ID_Pengeluaran, userId: user?.id });
      if (res.success) {
        toast.success("Data pengeluaran berhasil dihapus");
        queryClient.invalidateQueries({ queryKey: ['pengeluaran_list'] });
        setDeleteData(null);
      } else {
        toast.error(res.message || "Gagal menghapus data");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (row: any) => {
    setEditForm({
      deskripsi: row.Deskripsi,
      nominal: row.Nominal.toString(),
      categoryId: row.ID_Kategori,
    });
    setEditData(row);
  };

  const handleSaveEdit = async () => {
    if (!editData) return;
    setIsEditing(true);
    try {
      const payload = {
        id: editData.ID_Pengeluaran,
        deskripsi: editForm.deskripsi,
        nominal: editForm.nominal.replace(/\D/g, ""),
        categoryId: editForm.categoryId,
        userId: user?.id
      };
      const res = await fetchGAS("update_pengeluaran", "POST", payload);
      if (res.success) {
        toast.success("Data pengeluaran berhasil diperbarui");
        queryClient.invalidateQueries({ queryKey: ['pengeluaran_list'] });
        setEditData(null);
      } else {
        toast.error(res.message || "Gagal memperbarui data");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] p-6 rounded-2xl border border-slate-200  shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-green-600" />
            Pengeluaran Aktual
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Pencatatan realisasi dana dan bukti struk pengeluaran</p>
        </div>
        <Link href="/pengeluaran/baru">
          <Button className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 h-10 rounded-xl shadow-md shadow-primary/20 transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Catat Pengeluaran
          </Button>
        </Link>
      </div>

      <Card className="bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-slate-200  soft-shadow rounded-2xl overflow-hidden">
        <div className="p-5 flex flex-col xl:flex-row justify-between items-center gap-4 border-b border-slate-100 dark:border-white/5  bg-slate-50/50 dark:bg-slate-900/20">
          <div className="relative w-full xl:w-80 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Cari Deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white dark:bg-[#070D07] border-slate-200 dark:border-slate-700 h-10 rounded-xl focus-visible:ring-primary shadow-sm w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
            {/* Filter Date Range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 h-10 rounded-xl font-medium shrink-0">
                  <CalendarRange className="w-4 h-4 mr-2" />
                  {dateRange.start && dateRange.end 
                    ? `${dateRange.start} s/d ${dateRange.end}`
                    : dateRange.start ? `Sejak ${dateRange.start}`
                    : dateRange.end ? `Hingga ${dateRange.end}`
                    : "Filter Tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5 shadow-xl">
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Rentang Waktu</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Pilih batas tanggal pengeluaran</p>
                </div>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-start" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Dari Tanggal</Label>
                    <Input 
                      id="date-start" 
                      type="date" 
                      value={dateRange.start} 
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      className="rounded-xl h-10 dark:bg-[#0A100D] border-slate-200 dark:border-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-end" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Sampai Tanggal</Label>
                    <Input 
                      id="date-end" 
                      type="date" 
                      value={dateRange.end} 
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      className="rounded-xl h-10 dark:bg-[#0A100D] border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>
                {(dateRange.start || dateRange.end) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full h-9 rounded-xl text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 mt-2"
                    onClick={() => setDateRange({ start: "", end: "" })}
                  >
                    Reset Tanggal
                  </Button>
                )}
              </PopoverContent>
            </Popover>

            {/* Sort Data */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 h-10 rounded-xl font-medium shrink-0">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Urutkan: {sortBy}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-2">
                <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                  <DropdownMenuRadioItem value="Terbaru" className="cursor-pointer rounded-xl text-sm font-medium py-2.5">Terbaru</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Terlama" className="cursor-pointer rounded-xl text-sm font-medium py-2.5">Terlama</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Terbesar" className="cursor-pointer rounded-xl text-sm font-medium py-2.5">Nominal Terbesar</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Terkecil" className="cursor-pointer rounded-xl text-sm font-medium py-2.5">Nominal Terkecil</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter Status */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 h-10 rounded-xl font-medium shrink-0">
                  <Filter className="w-4 h-4 mr-2" />
                  {statusFilter === "Semua" ? "Filter Status" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-2">
                <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                  <DropdownMenuRadioItem value="Semua" className="cursor-pointer rounded-xl text-sm font-medium py-2.5">Semua Status</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Pending Review" className="cursor-pointer rounded-xl text-sm font-medium py-2.5">Pending Review</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Disetujui" className="cursor-pointer rounded-xl text-sm font-medium py-2.5">Disetujui</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Ditolak" className="cursor-pointer rounded-xl text-sm font-medium py-2.5">Ditolak</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-[#070D07]/50">
              <TableRow className="border-b border-slate-100 dark:border-white/5">
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 py-4 px-5">No.</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 min-w-[250px]">Pengeluaran</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Tanggal</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Kategori</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 text-right">Nominal</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 text-center">Bukti</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 text-center">Status</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 w-24 text-right pr-5">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="relative w-10 h-10">
                        <div className="absolute inset-0 border-[3px] border-[#B2F082]/20 rounded-full"></div>
                        <div className="absolute inset-0 border-[3px] border-[#B2F082] rounded-full border-t-transparent animate-spin"></div>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse font-medium">Memuat data pengeluaran...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredData.length > 0 ? (
                filteredData.map((row: any, idx: number) => {
                  const matchedCat = categoryMap.get(row.ID_Kategori) || { Nama_Kategori: row.ID_Kategori, Icon: "Tags" };
                  const IconComponent = (LucideIcons as any)[matchedCat.Icon] || LucideIcons.Tags;

                  return (
                    <TableRow key={row.ID_Pengeluaran} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                      <TableCell className="font-medium text-slate-500 dark:text-slate-400 py-4 px-5">{idx + 1}</TableCell>
                      <TableCell className="font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold max-w-[200px] truncate" title={row.Deskripsi}>{row.Deskripsi}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {new Date(row.Tanggal_Transaksi).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                        {matchedCat.Nama_Kategori}
                      </TableCell>
                      <TableCell className="font-bold text-slate-900 dark:text-white text-right">
                        {formatCurrency(Number(row.Nominal))}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.URL_Lampiran ? (
                          <div 
                            className="inline-block cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 w-11 h-11 hover:ring-2 hover:ring-primary hover:shadow-lg transition-all shadow-sm bg-slate-50 dark:bg-slate-800"
                            onClick={() => setPreviewImage(row.URL_Lampiran)}
                            title="Lihat Bukti Foto"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={row.URL_Lampiran} alt="Bukti" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "font-semibold rounded-full px-3 py-1 text-[11px] border-0",
                            row.Status === "Disetujui" && "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
                            row.Status === "Pending Review" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
                            row.Status === "Ditolak" && "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                          )}
                        >
                          {row.Status}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-24 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button onClick={() => handleEditClick(row)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors" title="Edit Data">
                            <LucideIcons.Edit2 className="w-4 h-4" />
                          </Button>
                          <Button onClick={() => handleDeleteClick(row)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Hapus Data">
                            <LucideIcons.Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-48 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Receipt className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                      <p>Tidak ada data pengeluaran yang ditemukan.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteData} onOpenChange={(open) => !open && setDeleteData(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white dark:bg-[#070D07] border-slate-200 dark:border-slate-800 shadow-2xl">
          <DialogHeader className="flex flex-col items-center text-center gap-2">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-2">
              <LucideIcons.AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Konfirmasi Hapus</DialogTitle>
            <DialogDescription className="text-base text-slate-500 dark:text-slate-400">
              Apakah Anda yakin ingin menghapus data pengeluaran <span className="font-bold text-slate-900 dark:text-white">{deleteData?.Deskripsi}</span>? Tindakan ini permanen dan tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Button variant="outline" onClick={() => setDeleteData(null)} disabled={isDeleting} className="rounded-2xl h-12 w-full sm:w-[140px] font-semibold text-slate-700 dark:text-slate-300">
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting} className="bg-red-500 hover:bg-red-600 text-white rounded-2xl h-12 w-full sm:w-[150px] font-semibold shadow-lg shadow-red-500/25">
              {isDeleting ? "Menghapus..." : "Ya, Hapus Data"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Data Modal */}
      <Dialog open={!!editData} onOpenChange={(open) => !open && setEditData(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white dark:bg-[#070D07] border-slate-200 dark:border-slate-800 shadow-2xl">
          <DialogHeader className="flex flex-col items-center text-center gap-1">
            <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-2">
              <LucideIcons.Edit3 className="w-7 h-7 text-blue-500" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Edit Pengeluaran</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">Ubah rincian pengeluaran di bawah ini.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-300 font-medium">Kategori Pengeluaran</Label>
              <select 
                className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:border-slate-800 dark:bg-[#070D07] dark:focus:ring-primary transition-all"
                value={editForm.categoryId}
                onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
              >
                <option value="" disabled>Pilih Kategori</option>
                {categories.map((cat: any) => (
                  <option key={cat.ID_Kategori} value={cat.ID_Kategori}>{cat.Nama_Kategori}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-300 font-medium">Deskripsi / Nama Pengeluaran</Label>
              <Input 
                value={editForm.deskripsi} 
                onChange={(e) => setEditForm({ ...editForm, deskripsi: e.target.value })} 
                placeholder="Contoh: Beli Kertas HVS"
                className="rounded-xl border-slate-200 dark:border-slate-800 dark:bg-[#070D07] h-11 transition-all focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-300 font-medium">Nominal (Rp)</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 text-sm font-semibold">Rp</span>
                </div>
                <Input 
                  value={editForm.nominal ? new Intl.NumberFormat('id-ID').format(Number(editForm.nominal.replace(/\D/g, ""))) : ""} 
                  onChange={(e) => setEditForm({ ...editForm, nominal: e.target.value.replace(/\D/g, "") })} 
                  placeholder="0"
                  className="pl-9 rounded-xl border-slate-200 dark:border-slate-800 dark:bg-[#070D07] h-11 transition-all focus:ring-primary font-medium"
                />
              </div>
            </div>
            
            {editData?.URL_Lampiran && (
              <div className="space-y-2 pt-1">
                <Label className="text-slate-700 dark:text-slate-300 font-medium">Bukti Transaksi (Foto)</Label>
                <div 
                  className="w-full h-32 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0A100D] flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 hover:ring-2 hover:ring-primary transition-all group relative"
                  onClick={() => setPreviewImage(editData.URL_Lampiran)}
                  title="Klik untuk memperbesar"
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all z-10 flex items-center justify-center">
                    <LucideIcons.ZoomIn className="text-white opacity-0 group-hover:opacity-100 w-8 h-8 drop-shadow-md" />
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editData.URL_Lampiran} alt="Preview Bukti" className="h-full w-full object-cover" />
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row justify-center gap-4 mt-2 sm:space-x-0">
            <Button variant="outline" onClick={() => setEditData(null)} disabled={isEditing} className="rounded-2xl h-12 w-full sm:w-[140px] font-semibold text-slate-700 dark:text-slate-300">
              Batal
            </Button>
            <Button onClick={handleSaveEdit} disabled={isEditing} className="bg-primary text-white hover:bg-primary/90 rounded-2xl h-12 w-full sm:w-[180px] font-semibold shadow-lg shadow-primary/25">
              {isEditing ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent 
          className="max-w-3xl p-1 bg-white/10 dark:bg-black/40 backdrop-blur-xl border-white/20 shadow-2xl flex flex-col items-center justify-center"
          overlayClassName="bg-black/60 backdrop-blur-md"
          showCloseButton={false}
        >
          <div className="relative w-full h-full flex justify-center items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setPreviewImage(null)}
              className="absolute -top-4 -right-4 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-white z-50 h-10 w-10 border border-white/10 shadow-xl"
            >
              <LucideIcons.X className="w-5 h-5" />
            </Button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={previewImage || ""} 
              alt="Bukti Transaksi" 
              className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl" 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
