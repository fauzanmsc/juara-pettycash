"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchGAS } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
};

export default function ReplenishmentPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['replenishment_list'],
    queryFn: () => fetchGAS('get_replenishment', 'GET'),
  });

  const replenishmentData = response?.data || [];

  // Hitung total dana diisi bulan ini (asumsi status Selesai / Disetujui)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  let totalBulanIni = 0;
  let lastTopupDate = "-";

  if (!isLoading && replenishmentData.length > 0) {
    totalBulanIni = replenishmentData.reduce((sum: number, item: any) => {
      const itemDate = new Date(item.Tanggal_Pengajuan || item.Tanggal_Dibuat);
      if (itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear && (item.Status === "Selesai" || item.Status === "Disetujui")) {
        return sum + Number(item.Nominal_Pengisian || 0);
      }
      return sum;
    }, 0);

    // Ambil tanggal topup terakhir
    const completedTopups = replenishmentData.filter((item: any) => item.Status === "Selesai" || item.Status === "Disetujui");
    if (completedTopups.length > 0) {
      // Asumsi data terurut atau kita ambil yang pertama karena biasanya descending
      const last = completedTopups[completedTopups.length - 1];
      lastTopupDate = new Date(last.Tanggal_Pengajuan || last.Tanggal_Dibuat).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] p-6 rounded-2xl border border-slate-200  shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-emerald-600 dark:text-[#B2F082]" />
            Replenishment (Top Up)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Riwayat pengisian kembali saldo kas kecil dari pusat</p>
        </div>
        <Button className="shadow-md shadow-primary/20 bg-[#0F3D29] hover:bg-[#0F3D29]/90 dark:bg-[#B2F082] dark:hover:bg-[#a0dc72] dark:text-[#0F3D29] text-white h-10 rounded-xl transition-all">
          <RefreshCw className="w-4 h-4 mr-2" />
          Ajukan Pengisian Saldo
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-[#0F3D29] to-emerald-900 text-white p-6 rounded-2xl soft-shadow col-span-1 lg:col-span-1 border-0 shadow-lg relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
          
          <div className="flex items-center gap-4 mb-6 text-white/90 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <ArrowUpCircle className="w-7 h-7" />
            </div>
            <p className="font-semibold text-lg">Total Dana Diisi<br/><span className="text-sm font-normal text-white/70">Bulan Ini</span></p>
          </div>
          
          <div className="relative z-10">
            {isLoading ? (
              <Skeleton className="h-10 w-48 bg-white/20" />
            ) : (
              <h2 className="text-4xl font-bold tracking-tight">{formatCurrency(totalBulanIni)}</h2>
            )}
            <p className="text-sm mt-3 text-white/70 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Terakhir: {isLoading ? <Skeleton className="h-4 w-24 bg-white/20 inline-block" /> : lastTopupDate}
            </p>
          </div>
        </Card>

        <Card className="bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-slate-200  soft-shadow rounded-2xl col-span-1 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-white/5  bg-slate-50/50 dark:bg-slate-900/20">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              Riwayat Transaksi Top Up
            </h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-[#070D07]/50">
                <TableRow className="border-b border-slate-100 dark:border-white/5">
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-400 py-4 px-5">ID Topup</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Tanggal</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Keterangan</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-400 text-right">Nominal</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-400 text-center pr-5">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="px-5 py-4"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                      <TableCell className="pr-5"><Skeleton className="h-6 w-20 rounded-full mx-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : replenishmentData.length > 0 ? (
                  replenishmentData.map((row: any) => (
                    <TableRow key={row.ID_Replenishment || row.Nomor_Replenishment} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                      <TableCell className="font-medium text-slate-900 dark:text-white py-4 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-[#B2F082] flex items-center justify-center">
                            <RefreshCw className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-semibold">{row.Nomor_Replenishment}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {new Date(row.Tanggal_Pengajuan || row.Tanggal_Dibuat).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-sm text-slate-700 dark:text-slate-300">
                        {row.Alasan || row.Keterangan || '-'}
                      </TableCell>
                      <TableCell className="font-bold text-slate-900 dark:text-white text-right">
                        {formatCurrency(Number(row.Nominal_Pengisian))}
                      </TableCell>
                      <TableCell className="text-center pr-5">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "font-semibold rounded-full px-3 py-1 text-xs border-0",
                            row.Status === "Selesai" || row.Status === "Disetujui"
                              ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                              : row.Status === "Ditolak"
                              ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"
                          )}
                        >
                          {row.Status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-slate-500 dark:text-slate-400 flex-col gap-2">
                      <RefreshCw className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                      Belum ada riwayat top up.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
