"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { fetchGAS } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, FileText, ChevronRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
};

export default function PengajuanPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();
  const user = session?.user as any;

  const { data: response, isLoading } = useQuery({
    queryKey: ['pengajuan_list', user?.id, user?.role],
    queryFn: () => fetchGAS('get_pengajuan', 'GET', { userId: user?.id, role: user?.role }),
    enabled: !!user?.id,
  });

  const pengajuanData = response?.data || [];

  const filteredData = pengajuanData.filter(
    (item: any) =>
      item.Deskripsi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ID_Pengajuan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Nama_Pemohon?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] p-6 rounded-2xl border border-slate-200  shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Pengajuan Dana
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Kelola dan pantau semua pengajuan kas kecil</p>
        </div>
        <Link href="/pengajuan/baru">
          <Button className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 h-10 rounded-xl shadow-md shadow-primary/20 transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Buat Pengajuan
          </Button>
        </Link>
      </div>

      <Card className="bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-slate-200  soft-shadow rounded-2xl overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-100 dark:border-white/5  bg-slate-50/50 dark:bg-slate-900/20">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Cari ID, Pemohon, atau Keterangan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white dark:bg-[#070D07] border-slate-200 dark:border-slate-700 h-10 rounded-xl focus-visible:ring-primary shadow-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 h-10 rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-[#070D07]/50">
              <TableRow className="border-b border-slate-100 dark:border-white/5">
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 py-4 px-5">ID Pengajuan</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Tanggal</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Pemohon</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 max-w-[200px]">Keterangan</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 text-right">Nominal</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 text-center">Status</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="px-5"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full mx-auto" /></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))
              ) : filteredData.length > 0 ? (
                filteredData.map((row: any) => (
                  <TableRow key={row.ID_Pengajuan} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                    <TableCell className="font-medium text-slate-900 dark:text-white py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold">{row.ID_Pengajuan}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {new Date(row.Tanggal_Pengajuan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">{row.Nama_Pemohon || 'Unknown'}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{row.Divisi}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-700 dark:text-slate-300 max-w-[200px] truncate font-medium" title={row.Deskripsi}>
                      {row.Deskripsi}
                    </TableCell>
                    <TableCell className="font-bold text-slate-900 dark:text-white text-right">
                      {formatCurrency(Number(row.Nominal))}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "font-semibold rounded-full px-3 py-1 text-xs border-0",
                          (row.Status === "Disetujui" || row.Status === "Selesai") && "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
                          (row.Status === "Pending HM" || row.Status === "Pending Direktur") && "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
                          row.Status === "Ditolak" && "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                        )}
                      >
                        {row.Status}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-10 pr-5">
                      <Button variant="ghost" size="icon" className="text-slate-400 group-hover:text-primary transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-500 dark:text-slate-400 flex-col gap-2">
                    <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    Tidak ada data pengajuan yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
