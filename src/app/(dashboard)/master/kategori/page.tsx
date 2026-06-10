"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGAS } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";
import { Plus, Edit2, Trash2, Palette } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const AVAILABLE_ICONS = [
  "Pizza", "Car", "ShoppingBag", "Coffee", "Smartphone", "Monitor", 
  "Home", "Heart", "Tags", "Gift", "Plane", "Scissors", "Bus", "Wifi"
];

const PRESET_COLORS = [
  "#ef4444", "#ec4899", "#d946ef", "#8b5cf6", "#6366f1", "#3b82f6", "#0ea5e9",
  "#10b981", "#22c55e", "#eab308", "#f97316", "#f43f5e", "#94a3b8"
];

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Tags;
  return <IconComponent className={className} />;
};

export default function MasterKategoriPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    Nama_Kategori: "",
    Keterangan: "",
    Status: "Aktif",
    Warna_Hex: "#f43f5e",
    Icon: "Tags"
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

  const openModal = (category: any = null) => {
    if (category) {
      setEditingId(category.ID_Kategori);
      setFormData({
        Nama_Kategori: category.Nama_Kategori,
        Keterangan: category.Keterangan || "",
        Status: category.Status || "Aktif",
        Warna_Hex: category.Warna_Hex || "#f43f5e",
        Icon: category.Icon || "Tags"
      });
    } else {
      setEditingId(null);
      setFormData({ Nama_Kategori: "", Keterangan: "", Status: "Aktif", Warna_Hex: "#f43f5e", Icon: "Tags" });
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

  const CategoryCard = ({ cat }: { cat: any }) => (
    <div className="group relative bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-md transition-all">
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => openModal(cat)} className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-500 transition-colors">
          <Edit2 className="w-4 h-4" />
        </button>
        <button onClick={() => handleDelete(cat.ID_Kategori)} className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${cat.Warna_Hex || '#f43f5e'}15`, color: cat.Warna_Hex || '#f43f5e' }}
      >
        <DynamicIcon name={cat.Icon || "Tags"} className="w-5 h-5" />
      </div>
      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{cat.Nama_Kategori}</h3>
      {cat.Status === "Nonaktif" && (
        <div className="absolute bottom-4 right-4">
          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">Nonaktif</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Kategori
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Atur kategori pengeluaran dan pemasukan Anda.</p>
        </div>
        <Button 
          onClick={() => openModal()} 
          className="bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg shadow-primary/20 h-12 px-6 font-bold text-sm transition-all border-0 uppercase tracking-wide"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((cat: any) => <CategoryCard key={cat.ID_Kategori} cat={cat} />)}
            </div>
          ) : (
            <div className="text-slate-400 font-medium">Belum ada kategori terdaftar.</div>
          )}
        </div>
      )}

      {/* Modal Form */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent 
          overlayClassName="bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/60"
          className="sm:max-w-[420px] rounded-[2rem] bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border border-slate-200  p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          <DialogTitle className="sr-only">
            {editingId ? "Edit Kategori" : "Kategori Baru"}
          </DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nama */}
            <div className="space-y-4">
              <div className="flex-1 space-y-2">
                <Label className="text-slate-500 font-semibold text-sm">Nama Kategori</Label>
                <Input 
                  placeholder="Contoh: Konsumsi"
                  value={formData.Nama_Kategori}
                  onChange={(e) => setFormData({...formData, Nama_Kategori: e.target.value})}
                  required
                  className="rounded-2xl border-0 h-10 text-sm font-semibold text-slate-700 dark:text-white bg-white/50 dark:bg-slate-800/50 shadow-sm"
                />
              </div>
            </div>

            {/* Warna Picker */}
            <div className="space-y-4">
              <Label className="text-slate-500 font-semibold text-sm">Warna</Label>
              <div className="flex flex-wrap gap-3">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({...formData, Warna_Hex: color})}
                    className={cn(
                      "shrink-0 w-8 h-8 rounded-full transition-transform",
                      formData.Warna_Hex === color ? "scale-110 ring-4 ring-white shadow-lg" : "hover:scale-105 shadow-sm"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
                {/* Custom Color Picker via Label trick */}
                <Label 
                  htmlFor="custom-color"
                  className={cn(
                    "shrink-0 w-8 h-8 rounded-full cursor-pointer shadow-sm flex items-center justify-center transition-transform",
                    !PRESET_COLORS.includes(formData.Warna_Hex) ? "scale-110 ring-4 ring-white shadow-lg" : "hover:scale-105"
                  )}
                  style={{ background: 'conic-gradient(from 180deg at 50% 50%, #FF0000 0deg, #FF7A00 60deg, #FAFF00 120deg, #04FF00 180deg, #00C2FF 240deg, #6100FF 300deg, #FF0000 360deg)' }}
                >
                  <Input 
                    id="custom-color"
                    type="color"
                    value={formData.Warna_Hex}
                    onChange={(e) => setFormData({...formData, Warna_Hex: e.target.value})}
                    className="sr-only"
                  />
                </Label>
              </div>
            </div>

            {/* Icon Picker */}
            <div className="space-y-4">
              <Label className="text-slate-500 font-semibold text-sm">Ikon</Label>
              <div className="flex flex-wrap gap-3">
                {AVAILABLE_ICONS.map(iconName => {
                  const isSelected = formData.Icon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormData({...formData, Icon: iconName})}
                      className={cn(
                        "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        isSelected 
                          ? "shadow-lg text-white scale-105" 
                          : "bg-white/50 dark:bg-slate-800/50 text-slate-500 hover:bg-white dark:hover:bg-slate-800 shadow-sm"
                      )}
                      style={isSelected ? { backgroundColor: formData.Warna_Hex } : {}}
                    >
                      <DynamicIcon name={iconName} className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {editingId && (
              <div className="space-y-2">
                <Label className="text-slate-500 font-semibold text-sm">Status</Label>
                <select 
                  value={formData.Status}
                  onChange={(e) => setFormData({...formData, Status: e.target.value})}
                  className="w-full h-10 px-4 rounded-xl border-0 bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-white font-bold text-sm outline-none shadow-sm"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending} 
              className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-base h-11 shadow-md shadow-primary/20 transition-all border-0"
            >
              Simpan Kategori
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
