"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGAS } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Edit2, Trash2, Tags } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function MasterKategoriPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    Nama_Kategori: "",
    Keterangan: "",
    Status: "Aktif"
  });

  const { data: kategoriResponse, isLoading } = useQuery({
    queryKey: ['kategori'],
    queryFn: () => fetchGAS('get_kategori', 'GET'),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => fetchGAS('create_kategori', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori'] });
      toast.success("Kategori berhasil ditambahkan");
      closeModal();
    },
    onError: () => toast.error("Gagal menambahkan kategori")
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => fetchGAS('update_kategori', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori'] });
      toast.success("Kategori berhasil diperbarui");
      closeModal();
    },
    onError: () => toast.error("Gagal memperbarui kategori")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchGAS('delete_kategori', 'POST', { action: 'delete_kategori', id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori'] });
      toast.success("Kategori berhasil dihapus");
    },
    onError: () => toast.error("Gagal menghapus kategori")
  });

  const categories = kategoriResponse?.data || [];
  
  const filteredCategories = categories.filter((c: any) => 
    c.Nama_Kategori?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ID_Kategori?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (category: any = null) => {
    if (category) {
      setEditingId(category.ID_Kategori);
      setFormData({
        Nama_Kategori: category.Nama_Kategori,
        Keterangan: category.Keterangan || "",
        Status: category.Status || "Aktif"
      });
    } else {
      setEditingId(null);
      setFormData({ Nama_Kategori: "", Keterangan: "", Status: "Aktif" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ action: 'update_kategori', id: editingId, ...formData });
    } else {
      createMutation.mutate({ action: 'create_kategori', ...formData });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini? Data yang terhubung dengan pengeluaran mungkin terpengaruh.")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#151921] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Tags className="w-6 h-6 text-primary" />
            Master Kategori
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Kelola daftar kategori pengeluaran kas kecil</p>
        </div>
        <Button onClick={() => openModal()} className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md h-10 px-5 transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      <Card className="bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800/60 shadow-sm rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari ID atau nama kategori..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-700 h-9 rounded-xl"
            />
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-transparent">
              <TableHead className="w-[150px] font-bold text-slate-500 py-4 px-5">ID Kategori</TableHead>
              <TableHead className="font-bold text-slate-500">Nama Kategori</TableHead>
              <TableHead className="font-bold text-slate-500">Keterangan</TableHead>
              <TableHead className="w-[100px] text-center font-bold text-slate-500">Status</TableHead>
              <TableHead className="w-[100px] text-right font-bold text-slate-500">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell className="px-5"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full mx-auto" /></TableCell>
                  <TableCell><div className="flex justify-end gap-2"><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" /></div></TableCell>
                </TableRow>
              ))
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((cat: any) => (
                <TableRow key={cat.ID_Kategori} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group">
                  <TableCell className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Tags className="w-3 h-3" />
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">{cat.ID_Kategori}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-slate-800 dark:text-slate-200">{cat.Nama_Kategori}</TableCell>
                  <TableCell className="text-slate-500 text-sm font-medium">{cat.Keterangan}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn(
                      "font-semibold rounded-full border-0 px-2.5 py-0.5 text-[10px]",
                      cat.Status === "Aktif" ? "bg-green-50 text-green-600 dark:bg-green-500/10" : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                    )}>
                      {cat.Status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => openModal(cat)} className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.ID_Kategori)} className="h-8 w-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                      <Tags className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="font-medium text-slate-600 dark:text-slate-400">Tidak ada data kategori ditemukan</p>
                    <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau tambah kategori baru</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800 p-0 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                {editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
              {editingId ? "Edit Kategori" : "Kategori Baru"}
            </DialogTitle>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nama" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Kategori</Label>
              <Input 
                id="nama" 
                placeholder="Contoh: Konsumsi, Transportasi, ATK"
                value={formData.Nama_Kategori}
                onChange={(e) => setFormData({...formData, Nama_Kategori: e.target.value})}
                required
                className="rounded-xl border-slate-200 dark:border-slate-700 h-10 font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keterangan" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Keterangan (Opsional)</Label>
              <Input 
                id="keterangan" 
                placeholder="Penjelasan detail penggunaan..."
                value={formData.Keterangan}
                onChange={(e) => setFormData({...formData, Keterangan: e.target.value})}
                className="rounded-xl border-slate-200 dark:border-slate-700 h-10"
              />
            </div>
            {editingId && (
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status Aktif</Label>
                <select 
                  id="status"
                  value={formData.Status}
                  onChange={(e) => setFormData({...formData, Status: e.target.value})}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#151921] text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 dark:text-slate-200"
                >
                  <option value="Aktif">🟢 Aktif</option>
                  <option value="Nonaktif">⚫ Nonaktif</option>
                </select>
              </div>
            )}
            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={closeModal} className="rounded-xl h-10 px-5 text-slate-500 hover:text-slate-700 font-medium hover:bg-slate-100">Batal</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-xl h-10 px-6 font-semibold shadow-md">
                {editingId ? "Simpan Perubahan" : "Simpan Kategori"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
