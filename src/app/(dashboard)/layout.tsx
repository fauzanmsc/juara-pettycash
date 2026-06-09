"use client";

import { useAppStore } from "@/lib/store";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Receipt, FileText, RefreshCw, CheckSquare, Settings, LogOut, Menu, Bell, Search, History, HelpCircle, Wallet, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Pengajuan Dana", href: "/pengajuan" },
  { icon: Receipt, label: "Pengeluaran", href: "/pengeluaran" },
  { icon: CheckSquare, label: "Settlement", href: "/settlement" },
  { icon: RefreshCw, label: "Replenishment", href: "/replenishment" },
  { icon: CheckSquare, label: "Approval", href: "/approval", badge: 12 },
];

const secondaryMenuItems = [
  { icon: Tags, label: "Master Kategori", href: "/master/kategori" },
  { icon: History, label: "Audit Trail", href: "/audit" },
  { icon: Settings, label: "Pengaturan", href: "/pengaturan" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const user = session?.user as any;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0D0F14]">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-white dark:bg-[#151921] border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-20",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">JUARA</span>
                <span className="text-sm text-primary dark:text-blue-400 font-medium">PettyCash</span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center mx-auto">
              <Wallet className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
          <p className={cn("text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-3 px-2 uppercase tracking-wider", !sidebarOpen && "hidden")}>TRANSAKSI</p>
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.label} href={item.href} className="block relative">
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 dark:bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.6)]" />
                )}
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                    isActive
                      ? "bg-blue-50/80 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold ml-1"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-blue-600 dark:text-blue-400 drop-shadow-sm" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
                  {sidebarOpen && (
                    <span className="flex-1 text-sm tracking-tight">{item.label}</span>
                  )}
                  {sidebarOpen && item.badge && (
                    <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          <div className="my-6 border-t border-slate-100 dark:border-slate-800/50" />
          
          <p className={cn("text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-3 px-2 uppercase tracking-wider", !sidebarOpen && "hidden")}>SISTEM</p>
          {secondaryMenuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.label} href={item.href} className="block relative">
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 dark:bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.6)]" />
                )}
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                    isActive
                      ? "bg-blue-50/80 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold ml-1"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-blue-600 dark:text-blue-400 drop-shadow-sm" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
                  {sidebarOpen && <span className="text-sm tracking-tight">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </div>

        {/* User Profile in Sidebar Bottom */}
        <div className={cn(
          "rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/40 dark:to-slate-900/40 border border-slate-200/60 dark:border-slate-700/50 hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-all duration-300 group cursor-pointer relative overflow-hidden",
          sidebarOpen ? "p-3 m-3" : "p-1.5 mx-auto my-4 w-12 flex justify-center items-center"
        )}>
          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className={cn("flex items-center outline-none relative z-10 w-full", sidebarOpen ? "gap-3" : "justify-center")}>
                <div className="relative shrink-0 flex">
                  <Avatar className={cn(
                    "ring-2 ring-white dark:ring-[#151921] shadow-sm group-hover:scale-105 transition-transform duration-300 bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400",
                    sidebarOpen ? "h-10 w-10" : "h-9 w-9"
                  )}>
                    <AvatarImage src="/images/default-avatar.png" className="object-cover object-top" />
                    <AvatarFallback className="bg-transparent text-white font-bold text-sm shadow-inner">
                      {user?.name?.substring(0, 2).toUpperCase() || 'BS'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white dark:border-[#151921]"></span>
                  </div>
                </div>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-bold truncate text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium uppercase tracking-wider">{user?.role || "Admin Finance"}</p>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={12} className="w-64 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] bg-white/95 dark:bg-[#151921]/95 backdrop-blur-xl p-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
              <div className="px-3 py-3 mb-2 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                <Avatar className="h-10 w-10 shadow-sm border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-tr from-blue-600 to-indigo-500">
                  <AvatarImage src="/images/default-avatar.png" className="object-cover object-top" />
                  <AvatarFallback className="bg-transparent text-white font-bold">
                     {user?.name?.substring(0, 2).toUpperCase() || 'BS'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user?.name}</span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{user?.email || "user@jefgroup.com"}</span>
                </div>
              </div>
              
              <DropdownMenuGroup className="px-1">
                <Link href="/pengaturan">
                  <DropdownMenuItem className="py-2.5 px-3 rounded-xl cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:bg-slate-100 dark:focus:bg-slate-800/60 focus:text-blue-600">
                    <Settings className="mr-3 h-4 w-4" /> Pengaturan Akun
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="py-2.5 px-3 rounded-xl cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:bg-slate-100 dark:focus:bg-slate-800/60 focus:text-blue-600">
                  <HelpCircle className="mr-3 h-4 w-4" /> Bantuan & Support
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <div className="my-1 border-t border-slate-100 dark:border-slate-800/60" />
              <DropdownMenuItem className="py-2.5 px-3 rounded-xl cursor-pointer text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-600 mt-1 transition-colors" onClick={() => signOut()}>
                <LogOut className="mr-3 h-4 w-4" /> Keluar dari Sistem
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Dark Blue Header */}
        <div className="md:hidden bg-primary dark:bg-[#151921] text-white h-16 flex items-center justify-between px-4 z-20 border-b border-primary dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-md border border-white/30 rounded flex items-center justify-center text-white shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-sm tracking-tight">JUARA</span>
              <span className="text-xs">PettyCash</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-primary">
                8
              </span>
            </div>
            <Avatar className="h-8 w-8 cursor-pointer bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-sm ring-1 ring-white/20" onClick={() => signOut()}>
              <AvatarImage src="/images/default-avatar.png" className="object-cover object-top" />
              <AvatarFallback className="bg-transparent text-white font-bold text-xs">
                {user?.name?.substring(0, 2).toUpperCase() || 'BS'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Desktop Topbar */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 bg-white dark:bg-[#151921] border-b border-slate-200 dark:border-slate-800 z-10 sticky top-0">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-slate-500 dark:text-slate-400">
              <Menu className="w-5 h-5" />
            </Button>
            
            {/* Breadcrumb & Quick Action */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm mr-4">
                <span className="text-slate-400 dark:text-slate-500 font-medium capitalize">
                  {pathname.split('/')[1] || 'Dashboard'}
                </span>
                {pathname.split('/')[2] && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">/</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold capitalize">
                      {pathname.split('/')[2]}
                    </span>
                  </>
                )}
              </div>
              
              <Link href="/pengajuan/baru">
                <Button className="h-9 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-sm shadow-blue-500/20 transition-all font-semibold text-xs border-0">
                  + Pengajuan Cepat
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="group relative flex items-center justify-center">
              <ThemeToggle />
              <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md whitespace-nowrap z-50">
                Ubah Tema
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative cursor-pointer text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors group flex items-center justify-center outline-none">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-[#151921] group-hover:animate-bounce">
                    8
                  </span>
                  <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md whitespace-nowrap z-50">
                    Notifikasi
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={12} className="w-80 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] bg-white/95 dark:bg-[#151921]/95 backdrop-blur-xl p-0 animate-in slide-in-from-top-2 fade-in duration-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">Notifikasi</h3>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline">Tandai semua dibaca</span>
                </div>
                <div className="max-h-[320px] overflow-y-auto overflow-x-hidden scrollbar-hide">
                  <div className="p-4 border-b border-slate-50 dark:border-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors relative">
                    <div className="w-2 h-2 rounded-full bg-blue-500 absolute left-2 top-6"></div>
                    <div className="pl-3">
                      <p className="text-sm text-slate-800 dark:text-slate-200 font-bold">Pengajuan #REQ-002 Disetujui</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Pengajuan dana operasional bulanan telah disetujui oleh Direktur.</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium flex items-center gap-1"><History className="w-3 h-3" /> 10 menit yang lalu</p>
                    </div>
                  </div>
                  <div className="p-4 border-b border-slate-50 dark:border-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors relative">
                    <div className="w-2 h-2 rounded-full bg-blue-500 absolute left-2 top-6"></div>
                    <div className="pl-3">
                      <p className="text-sm text-slate-800 dark:text-slate-200 font-bold">Pengeluaran Baru Tercatat</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Fauzan (Admin Finance) mencatat pengeluaran Konsumsi Rp 320.000.</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium flex items-center gap-1"><History className="w-3 h-3" /> 1 jam yang lalu</p>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors relative">
                    <div className="pl-3">
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Settlement Selesai</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Laporan settlement bulan Mei telah divalidasi oleh Finance.</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium flex items-center gap-1"><History className="w-3 h-3" /> Kemarin, 14:30</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 text-center border-t border-slate-100 dark:border-slate-800/60 cursor-pointer group">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Lihat Semua Notifikasi</span>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="relative cursor-pointer text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors group flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
              <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md whitespace-nowrap z-50">
                Bantuan
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2.5 pl-5 border-l border-slate-200 dark:border-slate-700 cursor-pointer group outline-none">
                  <div className="w-8 h-8 bg-gradient-to-tr from-slate-100 to-white dark:from-slate-800 dark:to-slate-700 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-600/50 flex items-center justify-center group-hover:shadow-md group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-all duration-300">
                    <span className="text-sm">🏢</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight">Workspace</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">JEF GROUP ID</span>
                  </div>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-400 ml-1 group-hover:text-blue-500 transition-colors"><path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95013 7.49999 9.95013C7.38064 9.95013 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={12} className="w-56 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] bg-white/95 dark:bg-[#151921]/95 backdrop-blur-xl p-2 animate-in slide-in-from-top-2 fade-in duration-200">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-2">Pilih Workspace</DropdownMenuLabel>
                  <DropdownMenuItem className="py-2.5 px-3 rounded-xl cursor-pointer bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold mb-1 focus:bg-blue-50 dark:focus:bg-blue-900/30 focus:text-blue-700 dark:focus:text-blue-400">
                    <span className="mr-2">🏢</span> JEF GROUP ID
                    <CheckSquare className="ml-auto h-4 w-4 text-blue-600" />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2.5 px-3 rounded-xl cursor-pointer text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-colors mb-1 focus:bg-slate-100 dark:focus:bg-slate-800/60 focus:text-slate-900">
                    <span className="mr-2">🌍</span> JEF GROUP SG
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2.5 px-3 rounded-xl cursor-pointer text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-colors focus:bg-slate-100 dark:focus:bg-slate-800/60 focus:text-slate-900">
                    <span className="mr-2">🌏</span> JEF GROUP MY
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1 border-slate-100 dark:border-slate-800/60" />
                <DropdownMenuItem className="py-2.5 px-3 rounded-xl cursor-pointer text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-500/10 focus:bg-blue-50 dark:focus:bg-blue-500/10 focus:text-blue-700 transition-colors mt-1">
                  <div className="w-5 h-5 rounded-full border-2 border-dashed border-blue-400 flex items-center justify-center mr-3">
                    <span className="text-xs">+</span>
                  </div>
                  Tambah Workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 md:pb-8 scroll-smooth">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#151921] border-t border-slate-200 dark:border-slate-800 z-50 px-2 py-2 safe-area-bottom pb-6">
        <div className="flex justify-between items-center px-4">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-primary dark:text-blue-400">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-medium">Dashboard</span>
          </Link>
          
          <Link href="/pengeluaran" className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500">
            <Receipt className="w-5 h-5" />
            <span className="text-[10px] font-medium">Transaksi</span>
          </Link>

          {/* Floating Action Button Center */}
          <Link href="/pengajuan/baru" className="relative -top-5">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/40 border-4 border-slate-50 dark:border-[#0D0F14]">
              <span className="text-2xl font-light leading-none">+</span>
            </div>
          </Link>

          <Link href="/approval" className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 relative">
            <CheckSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0 rounded-full">
              12
            </span>
            <span className="text-[10px] font-medium">Approval</span>
          </Link>

          <button onClick={toggleSidebar} className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 bg-transparent border-0 outline-none">
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
