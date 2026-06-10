"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchGAS } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { History, FileText, User, Settings, ShieldCheck, ArrowRight, Activity } from "lucide-react";

const getIconAndColorForModule = (modul: string, aktivitas: string) => {
  const m = (modul || "").toLowerCase();
  const a = (aktivitas || "").toLowerCase();

  if (a.includes("login") || m.includes("auth")) {
    return { icon: User, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950" };
  }
  if (m.includes("pengajuan")) {
    return { icon: FileText, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950" };
  }
  if (m.includes("approval") || a.includes("approve") || a.includes("setuju")) {
    return { icon: ShieldCheck, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950" };
  }
  if (m.includes("setting") || m.includes("pengaturan")) {
    return { icon: Settings, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950" };
  }
  return { icon: Activity, color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-900" };
};

const formatTime = (isoString: string) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const formatDateStr = (isoString: string) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Hari Ini";
  if (date.toDateString() === yesterday.toDateString()) return "Kemarin";
  
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function AuditPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['logs_list'],
    queryFn: () => fetchGAS('get_logs', 'GET'),
  });

  const logsData = response?.data || [];
  // Sort descending by Waktu
  const sortedLogs = [...logsData].sort((a, b) => new Date(b.Waktu).getTime() - new Date(a.Waktu).getTime());

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 backdrop-blur-xl dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] p-6 rounded-2xl border border-slate-200  shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-primary dark:text-[#B2F082]" />
            Audit Trail
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Pantau riwayat aktivitas dan perubahan data yang terjadi di dalam sistem.</p>
        </div>
      </div>

      <Card className="bg-white/70 backdrop-blur-xl dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-slate-200  soft-shadow rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-white/5  pb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary dark:text-[#B2F082]" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Riwayat Terbaru</h2>
          </div>
        </div>

        <div className="relative border-l-2 border-slate-100 dark:border-white/5/60 ml-4 space-y-8 pb-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="relative pl-8">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse" />
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <div className="text-left sm:text-right space-y-2">
                    <Skeleton className="h-4 w-16 sm:ml-auto" />
                    <Skeleton className="h-3 w-20 sm:ml-auto" />
                  </div>
                </div>
              </div>
            ))
          ) : sortedLogs.length > 0 ? (
            sortedLogs.map((log: any) => {
              const { icon: Icon, color, bg } = getIconAndColorForModule(log.Modul, log.Aktivitas);
              return (
                <div key={log.ID_Log} className="relative group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 py-4 pl-12 pr-4 -ml-4 rounded-2xl transition-colors">
                  {/* Timeline dot */}
                  <div className={`absolute left-0 top-5 w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center transition-transform group-hover:scale-110 ${bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-semibold text-slate-900 dark:text-slate-200">{log.Nama_Pengguna || log.ID_Pengguna}</span>
                        <span className="text-xs font-medium bg-slate-100 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 px-2.5 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-700/50">
                          {log.Modul}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm">
                        <span className="font-medium text-slate-900 dark:text-slate-100 mr-1">{log.Aktivitas}:</span> 
                        {log.Keterangan}
                      </p>
                    </div>
                    
                    <div className="text-left sm:text-right mt-1 sm:mt-0">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{formatTime(log.Waktu)}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{formatDateStr(log.Waktu)}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
             <div className="text-center py-10 text-slate-500">
               <History className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
               <p>Belum ada riwayat aktivitas terbaru.</p>
             </div>
          )}
        </div>
        
        {sortedLogs.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5  text-center">
            <Button variant="outline" className="text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Tampilkan Lebih Banyak <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
