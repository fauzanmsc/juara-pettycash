"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGAS } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, Download, ArrowUpDown, FileText, Search, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatRp } from "@/lib/utils";

export default function JurnalKeuanganPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: response, isLoading } = useQuery({
    queryKey: ['jurnal_keuangan'],
    queryFn: () => fetchGAS('get_jurnal', 'GET'),
  });

  const jurnalData = response?.data || [];

  const filteredAndSortedData = useMemo(() => {
    let result = jurnalData.filter((item: any) => {
      const search = searchTerm.toLowerCase();
      return (
        item.keterangan?.toLowerCase().includes(search) ||
        item.kategori?.toLowerCase().includes(search) ||
        item.rekening?.toLowerCase().includes(search)
      );
    });

    if (sortOrder === "asc") {
      result = result.sort((a: any, b: any) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
    } else {
      result = result.sort((a: any, b: any) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    }

    return result;
  }, [jurnalData, searchTerm, sortOrder]);

  const toggleSort = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  const totalDebit = filteredAndSortedData.reduce((sum: number, row: any) => sum + (Number(row.debit) || 0), 0);
  const totalKredit = filteredAndSortedData.reduce((sum: number, row: any) => sum + (Number(row.kredit) || 0), 0);
  const totalBalance = totalDebit - totalKredit;

  const handleExport = () => {
    exportCSV();
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Tanggal,Keterangan,Kategori,Rekening,Debit,Kredit,Balance\n";
    
    filteredAndSortedData.forEach((item: any) => {
      const row = [
        new Date(item.tanggal).toLocaleDateString('id-ID'),
        `"${item.keterangan?.replace(/"/g, '""')}"`,
        `"${item.kategori}"`,
        `"${item.rekening}"`,
        item.debit || 0,
        item.kredit || 0,
        item.balance || 0
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Jurnal_Keuangan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-primary" />
            Jurnal Keuangan
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Ringkasan transaksi dalam format debit dan kredit.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari deskripsi / kategori..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070D07] text-sm focus-visible:ring-primary shadow-sm"
            />
          </div>
          <Button 
            onClick={toggleSort}
            variant="outline" 
            className="w-full sm:w-auto h-11 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070D07] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm transition-all"
          >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Sort
          </Button>
          <Button 
            onClick={handleExport}
            className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#E2FF38] hover:bg-[#d4f02a] text-slate-900 font-bold shadow-lg shadow-[#E2FF38]/20 transition-all border-0"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl dark:bg-[#0A120A] dark:backdrop-blur-xl dark:border-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-slate-200 rounded-3xl overflow-hidden shadow-xl transition-all">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/80 dark:bg-[#0D180D] border-b border-slate-200 dark:border-white/5">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold text-slate-600 dark:text-slate-400 py-5 px-6">Tanggal</TableHead>
                <TableHead className="font-bold text-slate-600 dark:text-slate-400 min-w-[250px]">Keterangan / Kategori</TableHead>
                <TableHead className="font-bold text-slate-600 dark:text-slate-400">Rekening</TableHead>
                <TableHead className="font-bold text-slate-600 dark:text-slate-400 text-right">Debit (Masuk)</TableHead>
                <TableHead className="font-bold text-slate-600 dark:text-slate-400 text-right">Kredit (Keluar)</TableHead>
                <TableHead className="font-bold text-slate-600 dark:text-slate-400 text-right pr-6">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="border-b border-slate-100 dark:border-white/5">
                    <TableCell className="px-6 py-4"><Skeleton className="h-5 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" /></TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-3 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24 ml-auto rounded-lg bg-slate-200 dark:bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24 ml-auto rounded-lg bg-slate-200 dark:bg-slate-800" /></TableCell>
                    <TableCell className="pr-6"><Skeleton className="h-5 w-24 ml-auto rounded-lg bg-slate-200 dark:bg-slate-800" /></TableCell>
                  </TableRow>
                ))
              ) : filteredAndSortedData.length > 0 ? (
                <>
                {filteredAndSortedData.map((row: any, idx: number) => (
                  <TableRow key={row.id + idx} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                    <TableCell className="font-semibold text-slate-700 dark:text-slate-300 py-4 px-6">
                      {new Date(row.tanggal).toLocaleDateString('en-CA')}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-900 dark:text-white">{row.keterangan}</span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{row.kategori}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-600 dark:text-slate-400">
                      {row.rekening}
                    </TableCell>
                    <TableCell className="font-bold text-right w-40">
                      {row.debit > 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {formatRp(row.debit)}
                        </span>
                      ) : (
                        <span className="text-emerald-600/50 dark:text-emerald-400/50">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-bold text-right w-40">
                      {row.kredit > 0 ? (
                        <span className="text-rose-600 dark:text-rose-400">
                          {formatRp(row.kredit)}
                        </span>
                      ) : (
                        <span className="text-rose-600/50 dark:text-rose-400/50">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-bold text-slate-800 dark:text-slate-200 text-right pr-6 w-40">
                      {formatRp(row.balance)}
                    </TableCell>
                  </TableRow>
                ))
              }
                <TableRow className="border-t-2 border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#0D180D]/50 hover:bg-slate-50/50 dark:hover:bg-[#0D180D]/50">
                  <TableCell colSpan={3} className="text-right font-bold text-slate-800 dark:text-slate-200 py-5 px-6">
                    Total Periode Ini
                  </TableCell>
                  <TableCell className="font-bold text-right w-40 text-emerald-600 dark:text-emerald-400">
                    {formatRp(totalDebit)}
                  </TableCell>
                  <TableCell className="font-bold text-right w-40 text-rose-600 dark:text-rose-400">
                    {formatRp(totalKredit)}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900 dark:text-white text-right pr-6 w-40">
                    {formatRp(totalBalance)}
                  </TableCell>
                </TableRow>
              </>
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Tidak ada jurnal ditemukan</p>
                      <p className="text-sm text-slate-500 max-w-sm">
                        Belum ada data transaksi jurnal keuangan. Catat pengeluaran atau replenishment terlebih dahulu.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
