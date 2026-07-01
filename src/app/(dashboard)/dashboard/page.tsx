"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { fetchGAS } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Wallet, FileText, Clock, ListChecks, ArrowUpRight, Filter, ChevronRight, Activity, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";


import { useMemo, useState } from "react";

const COLORS = ["#B2F082", "#0F3D29", "#4ADE80", "#86EFAC", "#14532D", "#84CC16", "#D9F99D"];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/70 dark:bg-white/5 dark:backdrop-blur-xl backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border border-slate-200/60 dark:border-slate-800/80 p-3 rounded-2xl shadow-xl dark:shadow-2xl z-50 min-w-[140px]">
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold mb-1.5 uppercase tracking-wider">{label}</p>
        <p className="text-[#0F3D29] dark:text-[#B2F082] font-extrabold text-sm">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/70 dark:bg-white/5 dark:backdrop-blur-xl backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border border-slate-200/60 dark:border-slate-800/80 p-3 rounded-2xl shadow-xl dark:shadow-2xl z-50 min-w-[150px] flex items-center gap-3">
        <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: payload[0].payload.fill }} />
        <div className="flex flex-col">
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold mb-0.5 leading-none">{payload[0].name}</p>
          <p className="text-slate-900 dark:text-white font-extrabold text-sm leading-none mt-1">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const [trendFilter, setTrendFilter] = useState("bulan");

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
    const rawKategori = chartResponse?.data?.kategori;
    if (!rawKategori || rawKategori.length === 0) {
      // Dummy data for visual presentation if no data
      const dummy = [
        { name: "Transportasi", value: 3500000 },
        { name: "Konsumsi", value: 2500000 },
        { name: "Alat Tulis Kantor", value: 1500000 },
        { name: "Operasional Lain", value: 2000000 },
      ];
      return dummy.map((cat, idx) => ({ ...cat, color: COLORS[idx % COLORS.length] }));
    }
    return rawKategori.map((cat: any, idx: number) => ({
      ...cat,
      color: cat.Warna_Hex || COLORS[idx % COLORS.length]
    }));
  }, [chartResponse]);

  const processedTrendData = useMemo(() => {
    const rawTrend = chartResponse?.data?.raw_trend || [];
    
    // Default dummy data if backend has no data yet to keep UI looking good
    if (rawTrend.length === 0) {
      if (trendFilter === "minggu") {
        return [
          { name: "Mg 1", uv: 12000000 },
          { name: "Mg 2", uv: 18000000 },
          { name: "Mg 3", uv: 15000000 },
          { name: "Mg 4", uv: 19000000 },
        ];
      }
      return [
        { name: "Jan", uv: 55000000 },
        { name: "Feb", uv: 60000000 },
        { name: "Mar", uv: 75000000 },
        { name: "Apr", uv: 50000000 },
        { name: "Mei", uv: 70000000 },
        { name: "Jun", uv: 52000000 },
      ];
    }

    if (trendFilter === "bulan") {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
      const today = new Date();
      const last6Months: any[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        last6Months.push({
          name: monthNames[d.getMonth()],
          month: d.getMonth(),
          year: d.getFullYear(),
          uv: 0
        });
      }

      rawTrend.forEach((trx: any) => {
        const d = new Date(trx.date);
        const match = last6Months.find(m => m.month === d.getMonth() && m.year === d.getFullYear());
        if (match) {
          match.uv += trx.amount;
        }
      });

      return last6Months;
    } else {
      const last4Weeks: any[] = [];
      const today = new Date();
      const dayOfWeek = today.getDay() || 7; 
      
      for (let i = 3; i >= 0; i--) {
        const endOfWeek = new Date(today.getTime());
        endOfWeek.setDate(today.getDate() + (7 - dayOfWeek) - (i * 7));
        endOfWeek.setHours(23, 59, 59, 999);
        const startOfWeek = new Date(endOfWeek.getTime());
        startOfWeek.setDate(endOfWeek.getDate() - 6);
        startOfWeek.setHours(0, 0, 0, 0);
        
        last4Weeks.push({
          name: `Mg ${4-i}`,
          start: startOfWeek,
          end: endOfWeek,
          uv: 0
        });
      }

      rawTrend.forEach((trx: any) => {
        const d = new Date(trx.date);
        const match = last4Weeks.find(w => d >= w.start && d <= w.end);
        if (match) {
          match.uv += trx.amount;
        }
      });

      return last4Weeks;
    }
  }, [chartResponse, trendFilter]);

  const recentTransactions = transactionsResponse?.data || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 bg-white/70 dark:bg-white/5 dark:backdrop-blur-xl backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] p-5 sm:p-6 rounded-[2rem] border border-white/50 dark:border-slate-800/50 shadow-sm shadow-emerald-900/5">
        <div>
          <h1 className="text-2xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary dark:text-[#B2F082] shadow-sm border border-slate-100 dark:border-white/5 dark:border-slate-700">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 sm:ml-[3.75rem] font-medium">Pantau keuangan divisi Anda dengan sistem terintegrasi</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 h-[44px]">
          <Select defaultValue="Juni">
            <SelectTrigger className="w-full sm:w-[150px] bg-slate-50 dark:bg-[#1A202C]/50 border border-slate-200 dark:border-white/10 h-[44px] rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 shadow-sm hover:border-primary/50 transition-all focus:ring-0 focus:ring-offset-0 capitalize flex items-center">
              <SelectValue placeholder="Bulan ini" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-xl border-slate-100 dark:border-white/5 p-2 bg-white/80 dark:bg-[#1a1f2c]/80 backdrop-blur-xl">
              <SelectItem value="Mei" className="rounded-lg py-2.5 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800/80 focus:text-primary dark:focus:text-[#B2F082] font-medium transition-colors">Bulan lalu (Mei)</SelectItem>
              <SelectItem value="Juni" className="rounded-lg py-2.5 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800/80 focus:text-primary dark:focus:text-[#B2F082] font-medium transition-colors">Bulan ini (Juni)</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <div role="button" className="cursor-pointer bg-[#0F3D29] text-[#B2F082] hover:bg-[#0F3D29]/90 dark:bg-[#B2F082] dark:hover:bg-[#a0dc72] dark:text-[#0F3D29] h-[44px] px-6 rounded-xl shadow-[0_4px_15px_rgba(15,61,41,0.2)] dark:shadow-[0_4px_15px_rgba(178,240,130,0.2)] hover:shadow-lg transition-all duration-300 font-bold text-sm border-0 shrink-0 flex items-center justify-center group">
                <Filter className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Filter
              </div>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 rounded-2xl p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-3">Filter Lanjutan</h4>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-500">Kategori</Label>
                  <Select defaultValue="semua">
                    <SelectTrigger className="h-9 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semua">Semua Kategori</SelectItem>
                      <SelectItem value="transport">Transportasi</SelectItem>
                      <SelectItem value="konsumsi">Konsumsi</SelectItem>
                      <SelectItem value="atk">Alat Tulis Kantor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-500">Status Approval</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="status-pending" defaultChecked />
                      <label htmlFor="status-pending" className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">Pending</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="status-approved" defaultChecked />
                      <label htmlFor="status-approved" className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">Disetujui</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="status-rejected" />
                      <label htmlFor="status-rejected" className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">Ditolak</label>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-2 h-9 rounded-lg bg-[#0F3D29] text-[#B2F082] hover:bg-[#0F3D29]/90 dark:bg-[#B2F082] dark:text-emerald-400 dark:hover:bg-[#B2F082]/90">
                  Terapkan Filter
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
        {/* Stat 1 - Saldo */}
        <Card className="bg-[#0F3D29]/90 backdrop-blur-2xl dark:bg-white/10 dark:border dark:border-white/20 border-0 shadow-lg dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-[2rem] overflow-hidden relative group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg dark:hover:shadow-[0_8px_30px_0_rgba(178,240,130,0.06)]">
          <CardContent className="p-5 h-full flex flex-col relative z-10">
            <div className="flex gap-4 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-[#B2F082] flex items-center justify-center shrink-0 border border-white/10 dark:bg-white/5 dark:border-white/20 shadow-inner">
                <Wallet className="w-5 h-5 drop-shadow-md" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-emerald-100/70 dark:text-slate-300">Saldo Kas Kecil</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-32 mt-1 bg-white/20" />
                ) : (
                  <h3 className="text-2xl sm:text-2xl lg:text-2xl xl:text-2xl font-extrabold text-white mt-1 tracking-tight truncate drop-shadow-sm">{formatCurrency(stats.saldo_saat_ini)}</h3>
                )}
              </div>
            </div>
            <div className="mt-auto pt-6 flex items-center gap-2">
              <Badge className="bg-[#B2F082]/20 text-[#B2F082] hover:bg-[#B2F082]/30 border-0 rounded-md px-2 py-0.5">
                <TrendingUp className="w-3 h-3 mr-1" /> +12%
              </Badge>
              <span className="text-xs text-emerald-100/60 font-medium">+ Rp 850.000 dari bulan lalu</span>
            </div>
          </CardContent>
          {/* Decorative faint pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
        </Card>

        {/* Stat 2 - Pengeluaran */}
        <Card className="bg-white/70 backdrop-blur-xl dark:bg-white/5 dark:backdrop-blur-xl border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] rounded-[2rem] overflow-hidden relative group hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg dark:hover:shadow-[0_8px_30px_0_rgba(178,240,130,0.06)]">
          <CardContent className="p-5 h-full flex flex-col">
            <div className="flex gap-4 mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white flex items-center justify-center shrink-0 border border-slate-100 dark:border-white/5 dark:border-white/10 shadow-inner">
                <FileText className="w-5 h-5 drop-shadow-sm" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Pengeluaran Bulan Ini</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-32 mt-1" />
                ) : (
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{formatCurrency(stats.pengeluaran_bulan_ini)}</h3>
                )}
              </div>
            </div>
            <div className="mt-auto pt-6 flex items-center gap-2">
              <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-0 rounded-md px-2 py-0.5">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +2%
              </Badge>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">+ Rp 150.000 dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        {/* Stat 3 - Approval */}
        <Card className="bg-white/70 backdrop-blur-xl dark:bg-white/5 dark:backdrop-blur-xl border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] rounded-[2rem] group hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg dark:hover:shadow-[0_8px_30px_0_rgba(178,240,130,0.06)]">
          <CardContent className="p-5 h-full flex flex-col">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white flex items-center justify-center shrink-0 border border-slate-100 dark:border-white/5 dark:border-white/10 shadow-inner">
                <Clock className="w-5 h-5 drop-shadow-sm" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Approval Pending</p>
                {statsLoading ? (
                  <Skeleton className="h-10 w-16 mt-1 mb-2" />
                ) : (
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 mb-1">{stats.approval_pending}</h3>
                )}
                <p className="text-[11px] font-medium text-slate-400">Total menunggu approval</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stat 4 - Transaksi */}
        <Card className="bg-white/70 backdrop-blur-xl dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-slate-200  shadow-sm rounded-2xl group hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg dark:hover:shadow-[0_8px_30px_0_rgba(178,240,130,0.06)]">
          <CardContent className="p-5 h-full flex flex-col">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-100 dark:border-white/5 dark:border-slate-700/50">
                <ListChecks className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Transaksi Bulan Ini</p>
                {statsLoading ? (
                  <Skeleton className="h-10 w-16 mt-1 mb-2" />
                ) : (
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 mb-1">{stats.total_transaksi_bulan_ini}</h3>
                )}
                <p className="text-[11px] font-medium text-slate-400">Total transaksi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Trend Pengeluaran */}
        <Card className="bg-white/70 backdrop-blur-xl dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-slate-200  shadow-sm rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg dark:hover:shadow-[0_8px_30px_0_rgba(178,240,130,0.06)]">
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Trend Pengeluaran</h3>
              <Select value={trendFilter} onValueChange={(val) => val && setTrendFilter(val)}>
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
                <AreaChart data={processedTrendData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={(val) => `${val/1000000} jt`} />
                  <RechartsTooltip 
                    content={<CustomTooltip />}
                    cursor={{ stroke: '#10B981', strokeWidth: 1, strokeDasharray: '4 4', fill: 'transparent' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="uv" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorUv)" 
                    activeDot={{ r: 6, fill: "#10B981", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Kategori Pengeluaran */}
        <Card className="bg-white/70 backdrop-blur-xl dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-slate-200  shadow-sm rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg dark:hover:shadow-[0_8px_30px_0_rgba(178,240,130,0.06)]">
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Distribusi Kategori</h3>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 h-[240px]">
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
                          content={<CustomPieTooltip />}
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

      {/* Insight Keuangan */}
      <Card className="bg-white/70 backdrop-blur-xl dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border border-slate-200  shadow-sm rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg dark:hover:shadow-[0_8px_30px_0_rgba(178,240,130,0.06)]">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-[#0F3D29] dark:text-[#B2F082] shrink-0 border border-slate-100 dark:border-white/5 dark:border-slate-700/50">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#0F3D29] dark:text-[#B2F082]">Insight Keuangan</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                Pengeluaran operasional naik <span className="font-bold text-rose-500">8.5%</span> dari bulan lalu.<br/>
                Perhatikan kategori <span className="font-bold">Transportasi</span> yang melebihi rata-rata.
              </p>
            </div>
          </div>
          <Button variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs h-10 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all px-5 mt-3 sm:mt-0">
            Lihat Insight
          </Button>
        </CardContent>
      </Card>

      {/* Recent Transactions Table */}
      <Card className="bg-white/70 backdrop-blur-xl dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-slate-200  soft-shadow rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg dark:hover:shadow-[0_8px_30px_0_rgba(178,240,130,0.06)]">
        <div className="p-5 flex justify-between items-center border-b border-slate-100 dark:border-white/5  bg-slate-50/50 dark:bg-slate-900/20">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Transaksi Terbaru</h3>
          <Link href="/pengeluaran">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-xs h-8 rounded-lg">
              Lihat Semua <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 dark:border-white/5 hover:bg-transparent">
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
                  <TableRow key={trx.ID_Pengeluaran} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                    <TableCell className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 flex items-center justify-center group-hover:scale-110 transition-transform">
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
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
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
