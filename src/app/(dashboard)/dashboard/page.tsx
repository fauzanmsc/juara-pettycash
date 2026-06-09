"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { fetchGAS } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, FileText, Clock, ListChecks, ArrowUpRight, Filter, ChevronRight, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMemo } from "react";

const trendData = [
  { name: "Jan", uv: 55000000 },
  { name: "Feb", uv: 60000000 },
  { name: "Mar", uv: 75000000 },
  { name: "Apr", uv: 50000000 },
  { name: "Mei", uv: 70000000 },
  { name: "Jun", uv: 52000000 },
];

const COLORS = ["#1D4ED8", "#22C55E", "#FBBF24", "#A855F7", "#F43F5E", "#06B6D4", "#94A3B8"];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  // Fetch Stats
  const { data: statsResponse, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard_stats', user?.id, user?.role],
    queryFn: () => fetchGAS('get_dashboard', 'GET', { userId: user?.id, role: user?.role }),
    enabled: !!user?.id,
  });

  // Fetch Chart Data
  const { data: chartResponse, isLoading: chartLoading } = useQuery({
    queryKey: ['dashboard_chart', user?.id],
    queryFn: () => fetchGAS('get_chart', 'GET', { userId: user?.id }),
    enabled: !!user?.id,
  });

  // Fetch Recent Transactions
  const { data: transactionsResponse, isLoading: txLoading } = useQuery({
    queryKey: ['pengeluaran_recent'],
    queryFn: () => fetchGAS('get_pengeluaran', 'GET', { limit: 5 }), // Assume limit supported
  });

  const stats = statsResponse?.data || {
    saldo_saat_ini: 0,
    pengeluaran_bulan_ini: 0,
    approval_pending: 0,
    total_transaksi_bulan_ini: 0
  };

  const categoryData = useMemo(() => {
    if (!chartResponse?.data?.kategori) return [];
    return chartResponse.data.kategori.map((cat: any, idx: number) => ({
      ...cat,
      color: COLORS[idx % COLORS.length]
    }));
  }, [chartResponse]);

  const recentTransactions = transactionsResponse?.data || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#151921] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Ringkasan kas kecil divisi Anda</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select defaultValue="juni">
            <SelectTrigger className="w-full sm:w-[140px] bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 h-10 rounded-xl">
              <SelectValue placeholder="Bulan ini" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mei">Bulan lalu</SelectItem>
              <SelectItem value="juni">Bulan ini</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary hover:bg-primary/90 text-white h-10 rounded-xl shadow-md shadow-primary/20 transition-all">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {/* Stat 1 - Saldo */}
        <Card className="bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800/60 soft-shadow rounded-2xl overflow-hidden relative group hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-5 pb-0 h-full flex flex-col">
            <div className="flex gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 flex items-center justify-center shrink-0 shadow-inner">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">Saldo Kas Kecil</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-32 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{formatCurrency(stats.saldo_saat_ini)}</h3>
                )}
              </div>
            </div>
            <div className="mt-auto pt-4 -mx-5 -mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 200 40" className="w-full h-10 stroke-green-500 fill-green-50 dark:fill-green-500/10" preserveAspectRatio="none">
                <path d="M0,40 L0,30 L20,25 L40,32 L60,20 L80,22 L100,10 L120,15 L140,5 L160,10 L180,2 L200,5 L200,40 Z" />
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Stat 2 - Pengeluaran */}
        <Card className="bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800/60 soft-shadow rounded-2xl overflow-hidden relative group hover:border-blue-500/50 transition-all duration-300">
          <CardContent className="p-5 pb-0 h-full flex flex-col">
            <div className="flex gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">Pengeluaran Bulan Ini</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-32 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{formatCurrency(stats.pengeluaran_bulan_ini)}</h3>
                )}
              </div>
            </div>
            <div className="mt-auto pt-4 -mx-5 -mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 200 40" className="w-full h-10 stroke-blue-500 fill-blue-50 dark:fill-blue-500/10" preserveAspectRatio="none">
                <path d="M0,40 L0,20 L20,25 L40,15 L60,18 L80,8 L100,15 L120,10 L140,20 L160,5 L180,8 L200,0 L200,40 Z" />
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Stat 3 - Approval */}
        <Card className="bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800/60 soft-shadow rounded-2xl group hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-5 h-full flex flex-col">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 shadow-inner">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">Approval Pending</p>
                {statsLoading ? (
                  <Skeleton className="h-10 w-16 mt-1 mb-2" />
                ) : (
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 mb-1">{stats.approval_pending}</h3>
                )}
                <p className="text-[11px] font-medium text-orange-500">Total menunggu approval</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stat 4 - Transaksi */}
        <Card className="bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800/60 soft-shadow rounded-2xl group hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-5 h-full flex flex-col">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 shadow-inner">
                <ListChecks className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">Transaksi Bulan Ini</p>
                {statsLoading ? (
                  <Skeleton className="h-10 w-16 mt-1 mb-2" />
                ) : (
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 mb-1">{stats.total_transaksi_bulan_ini}</h3>
                )}
                <p className="text-[11px] text-slate-400">Total transaksi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Pengeluaran */}
        <Card className="bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800/60 soft-shadow rounded-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Trend Pengeluaran</h3>
              <Select defaultValue="bulan">
                <SelectTrigger className="w-[110px] h-8 text-xs border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <SelectValue placeholder="Per Bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bulan">Per Bulan</SelectItem>
                  <SelectItem value="minggu">Per Minggu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-[240px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val) => `${val/1000000} jt`} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(29, 78, 216, 0.05)' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Bar dataKey="uv" fill="url(#colorUv)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Kategori Pengeluaran */}
        <Card className="bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800/60 soft-shadow rounded-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Distribusi Kategori</h3>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 h-[240px]">
              {chartLoading ? (
                <div className="w-[200px] h-[200px] flex items-center justify-center">
                  <Skeleton className="w-full h-full rounded-full" />
                </div>
              ) : categoryData.length > 0 ? (
                <>
                  <div className="h-[220px] w-[220px] shrink-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="transparent"
                        >
                          {categoryData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          formatter={(value) => [formatCurrency(Number(value)), 'Total']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                      <span className="text-xs text-slate-400">Total</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">100%</span>
                    </div>
                  </div>
                  <div className="space-y-3 w-full sm:w-auto flex-1 max-w-[200px]">
                    {categoryData.map((category: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-xs group cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: category.color }} />
                          <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">{category.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full w-full text-slate-400">
                  Belum ada data kategori
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card className="bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800/60 soft-shadow rounded-2xl overflow-hidden">
        <div className="p-5 flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Transaksi Terbaru</h3>
          <Link href="/pengeluaran">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-xs h-8 rounded-lg">
              Lihat Semua <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-transparent">
                <TableHead className="w-[150px] text-xs font-bold text-slate-500 dark:text-slate-400 py-4 px-5">ID</TableHead>
                <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400">Tanggal</TableHead>
                <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400">Deskripsi</TableHead>
                <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400 text-right">Nominal</TableHead>
                <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center">Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {txLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))
              ) : recentTransactions.length > 0 ? (
                recentTransactions.map((trx: any) => (
                  <TableRow key={trx.ID_Pengeluaran} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                    <TableCell className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{trx.ID_Pengeluaran}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {new Date(trx.Tanggal_Transaksi).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[200px] font-medium">{trx.Deskripsi}</TableCell>
                    <TableCell className="text-xs font-bold text-slate-800 dark:text-slate-200 text-right">{formatCurrency(trx.Nominal)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn(
                        "font-semibold rounded-full text-[10px] px-2.5 py-0.5 border-0",
                        trx.Status === "Disetujui" && "text-green-600 bg-green-50 dark:bg-green-500/10",
                        trx.Status === "Pending" && "text-orange-500 bg-orange-50 dark:bg-orange-500/10",
                        trx.Status === "Ditolak" && "text-red-600 bg-red-50 dark:bg-red-500/10"
                      )}>
                        {trx.Status}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-10">
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-400">Belum ada transaksi</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
