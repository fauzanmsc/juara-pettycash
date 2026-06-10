"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchGAS } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckSquare, Check, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
};

export default function ApprovalPage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const { data: response, isLoading } = useQuery({
    queryKey: ['approval_list', user?.id, user?.role],
    queryFn: () => fetchGAS('get_pengajuan', 'GET', { userId: user?.id, role: user?.role }),
    enabled: !!user?.id,
  });

  const pengajuanData = response?.data || [];

  // Hanya tampilkan yang Pending (misalnya Pending HM atau Pending Direktur)
  // dan ideally sesuai role, tapi di sini kita tampilkan semua yang statusnya ada kata 'Pending'
  const approvalData = pengajuanData.filter((item: any) => 
    item.Status?.toLowerCase().includes("pending")
  );

  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetchGAS('update_pengajuan_status', 'POST', {
        id,
        status,
        userId: user?.id
      });
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: (data, variables) => {
      toast.success(`Pengajuan ${variables.id} berhasil ${variables.status.toLowerCase()}`);
      queryClient.invalidateQueries({ queryKey: ['approval_list'] });
    },
    onError: (error) => {
      toast.error(error.message || "Terjadi kesalahan");
    }
  });

  const handleApprove = (id: string) => {
    if (confirm(`Apakah Anda yakin ingin MENYETUJUI pengajuan ${id}?`)) {
      updateStatusMutation.mutate({ id, status: "Disetujui" });
    }
  };

  const handleReject = (id: string) => {
    if (confirm(`Apakah Anda yakin ingin MENOLAK pengajuan ${id}?`)) {
      updateStatusMutation.mutate({ id, status: "Ditolak" });
    }
  };


  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] p-6 rounded-2xl border border-slate-200  shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-red-500" />
            Persetujuan (Approval)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Daftar antrean pengajuan yang menunggu keputusan Anda</p>
        </div>
      </div>

      <Card className="bg-white dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-slate-200  soft-shadow rounded-2xl overflow-hidden">
        <div className="p-5 flex justify-end items-center border-b border-slate-100 dark:border-white/5  bg-slate-50/50 dark:bg-slate-900/20">
          <Button variant="outline" size="sm" className="w-full sm:w-auto text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 h-10 rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            Filter Status
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
                <TableHead className="font-semibold text-slate-600 dark:text-slate-400 text-right pr-5">Aksi Persetujuan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="px-5"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full mx-auto" /></TableCell>
                    <TableCell className="pr-5"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : approvalData.length > 0 ? (
                approvalData.map((row: any) => (
                  <TableRow key={row.ID_Pengajuan} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <TableCell className="font-medium text-slate-900 dark:text-white py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center">
                          <CheckSquare className="w-4 h-4" />
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
                          "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"
                        )}
                      >
                        {row.Status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-5">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="outline" onClick={() => handleReject(row.ID_Pengajuan)} disabled={updateStatusMutation.isPending} className="h-9 w-9 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-900/30 transition-colors">
                          <X className="w-4 h-4" />
                        </Button>
                        <Button size="icon" onClick={() => handleApprove(row.ID_Pengajuan)} disabled={updateStatusMutation.isPending} className="h-9 w-9 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-sm shadow-green-600/20 transition-all">
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-500 dark:text-slate-400 flex-col gap-2">
                    <CheckSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    Tidak ada pengajuan yang perlu disetujui saat ini.
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
