"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, FileText, Clock, ListChecks, ArrowUpRight, Filter, ChevronRight, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const trendData = [
  { name: "Jan", uv: 55000000 },
  { name: "Feb", uv: 60000000 },
  { name: "Mar", uv: 75000000 },
  { name: "Apr", uv: 50000000 },
  { name: "Mei", uv: 70000000 },
  { name: "Jun", uv: 52000000 },
];

const categoryData = [
  { name: "Operasional", value: 35, color: "#1D4ED8" }, // blue-700
  { name: "ATK & Office", value: 25, color: "#22C55E" }, // green-500
  { name: "Transportasi", value: 20, color: "#FBBF24" }, // amber-400
  { name: "Makan & Minum", value: 10, color: "#A855F7" }, // purple-500
  { name: "Lainnya", value: 10, color: "#94A3B8" }, // slate-400
];

const recentTransactions = [
  { id: "EXP-202606-048", date: "12 Jun 2026", type: "Pengeluaran", desc: "Pembelian ATK untuk keperluan kantor", amount: 450000, status: "Pending Review" },
  { id: "ADV-202606-015", date: "11 Jun 2026", type: "Pengajuan Dana", desc: "Pengajuan dana kas kecil bulan Juni", amount: 10000000, status: "Pending HM" },
  { id: "SET-202606-008", date: "10 Jun 2026", type: "Settlement", desc: "Settlement pengajuan ADV-202605-010", amount: 8750000, status: "Approved" },
  { id: "EXP-202606-047", date: "09 Jun 2026", type: "Pengeluaran", desc: "Biaya transportasi meeting luar kota", amount: 350000, status: "Approved" },
  { id: "REP-202606-006", date: "08 Jun 2026", type: "Replenishment", desc: "Replenishment kas kecil periode Juni", amount: 12000000, status: "Pending HM" },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
};

export default function DashboardPage() {
  const { data: session } = useSession();
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Ringkasan kas kecil divisi Anda</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select defaultValue="juni">
            <SelectTrigger className="w-full sm:w-[140px] bg-white h-9">
              <SelectValue placeholder="Bulan ini" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mei">Bulan lalu</SelectItem>
              <SelectItem value="juni">Bulan ini</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary hover:bg-primary/90 text-white h-9 shadow-sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {/* Stat 1 - Saldo */}
        <Card className="bg-white border-slate-200 soft-shadow rounded-xl overflow-hidden relative group">
          <CardContent className="p-5 pb-0 h-full flex flex-col">
            <div className="flex gap-4 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-700">Saldo Kas Kecil</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">Rp 125.750.000</h3>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pl-14 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-600 text-[11px] font-bold">12.5%</span>
              <span className="text-slate-400 text-[11px]">dari bulan lalu</span>
            </div>
            <div className="mt-auto pt-4 -mx-5 -mb-2">
              <svg viewBox="0 0 200 40" className="w-full h-10 stroke-green-500 fill-green-50/50" preserveAspectRatio="none">
                <path d="M0,40 L0,30 L20,25 L40,32 L60,20 L80,22 L100,10 L120,15 L140,5 L160,10 L180,2 L200,5 L200,40 Z" />
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Stat 2 - Pengeluaran */}
        <Card className="bg-white border-slate-200 soft-shadow rounded-xl overflow-hidden relative">
          <CardContent className="p-5 pb-0 h-full flex flex-col">
            <div className="flex gap-4 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-700">Pengeluaran Bulan Ini</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">Rp 38.450.000</h3>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pl-14 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-blue-600 text-[11px] font-bold">8.2%</span>
              <span className="text-slate-400 text-[11px]">dari bulan lalu</span>
            </div>
            <div className="mt-auto pt-4 -mx-5 -mb-2">
              <svg viewBox="0 0 200 40" className="w-full h-10 stroke-blue-500 fill-blue-50/50" preserveAspectRatio="none">
                <path d="M0,40 L0,20 L20,25 L40,15 L60,18 L80,8 L100,15 L120,10 L140,20 L160,5 L180,8 L200,0 L200,40 Z" />
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Stat 3 - Approval */}
        <Card className="bg-white border-slate-200 soft-shadow rounded-xl">
          <CardContent className="p-5 h-full flex flex-col">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-700">Approval Pending</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1 mb-2">12</h3>
                <p className="text-[11px] font-medium text-orange-500">Total menunggu approval</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stat 4 - Transaksi */}
        <Card className="bg-white border-slate-200 soft-shadow rounded-xl">
          <CardContent className="p-5 h-full flex flex-col">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                <ListChecks className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-700">Transaksi Bulan Ini</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1 mb-2">48</h3>
                <p className="text-[11px] text-slate-400">Total transaksi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Pengeluaran */}
        <Card className="bg-white border-slate-200 soft-shadow rounded-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-sm text-slate-800">Trend Pengeluaran (6 Bulan Terakhir)</h3>
              <Select defaultValue="bulan">
                <SelectTrigger className="w-[110px] h-8 text-xs border-slate-200">
                  <SelectValue placeholder="Per Bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bulan">Per Bulan</SelectItem>
                  <SelectItem value="minggu">Per Minggu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-[220px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val) => `${val/1000000} jt`} />
                  <RechartsTooltip 
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Bar dataKey="uv" fill="#1D4ED8" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center items-center gap-2 mt-4">
                <div className="w-3 h-3 bg-[#1D4ED8] rounded-sm"></div>
                <span className="text-xs text-slate-500 font-medium">Pengeluaran (Rp)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kategori Pengeluaran */}
        <Card className="bg-white border-slate-200 soft-shadow rounded-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-sm text-slate-800">Pengeluaran Berdasarkan Kategori</h3>
              <Select defaultValue="bulan_ini">
                <SelectTrigger className="w-[110px] h-8 text-xs border-slate-200">
                  <SelectValue placeholder="Bulan Ini" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bulan_ini">Bulan Ini</SelectItem>
                  <SelectItem value="bulan_lalu">Bulan Lalu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 h-[220px]">
              <div className="h-[200px] w-[200px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="white"
                      strokeWidth={2}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value) => [`${value}%`, 'Persentase']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 w-full sm:w-auto flex-1 max-w-[200px]">
                {categoryData.map((category, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: category.color }} />
                      <span className="text-slate-700 font-medium">{category.name}</span>
                    </div>
                    <span className="text-slate-500 font-semibold">{category.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card className="bg-white border-slate-200 soft-shadow rounded-xl overflow-hidden">
        <div className="p-5 flex justify-between items-center border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-800">Transaksi Terbaru</h3>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-blue-50 text-xs h-8">
            Lihat Semua <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="w-[150px] text-xs font-bold text-slate-800 py-4 px-5">No. Transaksi</TableHead>
                <TableHead className="text-xs font-bold text-slate-800">Tanggal</TableHead>
                <TableHead className="text-xs font-bold text-slate-800">Jenis</TableHead>
                <TableHead className="max-w-[200px] text-xs font-bold text-slate-800">Deskripsi</TableHead>
                <TableHead className="text-xs font-bold text-slate-800">Nominal</TableHead>
                <TableHead className="text-xs font-bold text-slate-800">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((trx, idx) => (
                <TableRow key={trx.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <TableCell className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-medium text-slate-700">{trx.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 font-medium">{trx.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn(
                      "font-medium border-0 rounded-md text-[10px] px-2 py-0.5",
                      trx.type === "Pengeluaran" && "bg-red-50 text-red-600",
                      trx.type === "Pengajuan Dana" && "bg-blue-50 text-blue-600",
                      trx.type === "Settlement" && "bg-green-50 text-green-600",
                      trx.type === "Replenishment" && "bg-purple-50 text-purple-600"
                    )}>
                      {trx.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 truncate max-w-[200px] font-medium">{trx.desc}</TableCell>
                  <TableCell className="text-xs font-semibold text-slate-700">{formatCurrency(trx.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "font-semibold rounded-md text-[10px] px-2 py-0.5 border-0",
                      trx.status === "Approved" && "text-green-600 bg-green-50",
                      trx.status === "Pending Review" && "text-orange-500 bg-orange-50",
                      trx.status === "Pending HM" && "text-blue-500 bg-blue-50",
                    )}>
                      {trx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-10">
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
