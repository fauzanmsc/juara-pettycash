"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGAS } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckSquare, AlertTriangle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const formatRp = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function SettlementPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['settlement_list'],
    queryFn: () => fetchGAS('get_settlement', 'GET'),
  });

  const settlementData = response?.data || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] p-6 rounded-2xl border border-slate-200  shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-orange-500" />
            Penyelesaian (Settlement)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Rekonsiliasi antara dana yang diajukan dengan pengeluaran aktual</p>
        </div>
      </div>

      <Card className="bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-slate-200  soft-shadow rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-[#070D07]/50">
              <TableRow className="border-b border-slate-100 dark:border-white/5">
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 py-4 px-5">ID Settlement</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Ref. Pengajuan</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 text-right">Dana Diberikan</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 text-right">Pengeluaran Aktual</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 text-right">Selisih</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Catatan</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 text-center">Status</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 text-right pr-5">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="px-5 py-4"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full mx-auto" /></TableCell>
                    <TableCell className="pr-5"><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : settlementData.length > 0 ? (
                settlementData.map((row: any) => (
                  <TableRow key={row.ID_PJ || row.Nomor_Settlement} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    <TableCell className="font-medium text-slate-900 dark:text-white py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
                          <CheckSquare className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold">{row.Nomor_Settlement}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400 font-mono text-xs">{row.ID_Pengajuan || '-'}</TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300 text-right font-medium">{formatRp(Number(row.Dana_Diterima))}</TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300 text-right font-medium">{formatRp(Number(row.Total_Pengeluaran))}</TableCell>
                    <TableCell className={cn(
                      "font-bold text-right",
                      Number(row.Selisih) > 0 ? 'text-green-600 dark:text-green-400' : Number(row.Selisih) < 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
                    )}>
                      {Number(row.Selisih) > 0 ? '+' : ''}{formatRp(Number(row.Selisih))}
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400 text-sm">
                      {Number(row.Selisih) < 0 && <AlertTriangle className="w-3 h-3 inline mr-1 text-red-500" />}
                      {row.Catatan}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "font-semibold rounded-full px-3 py-1 text-xs border-0",
                          row.Status === "Selesai" || row.Status === "Disetujui"
                            ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"
                        )}
                      >
                        {row.Status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-5">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-primary transition-colors">
                        Detail <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-slate-500 dark:text-slate-400 flex-col gap-2">
                    <CheckSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    Belum ada data settlement.
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
