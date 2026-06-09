"use client";

import { useAppStore } from "@/lib/store";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Receipt, FileText, RefreshCw, CheckSquare, Settings, LogOut, Menu, Bell, Search, History, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Pengajuan Dana", href: "/pengajuan" },
  { icon: Receipt, label: "Pengeluaran", href: "/pengeluaran" },
  { icon: CheckSquare, label: "Settlement", href: "/settlement" },
  { icon: RefreshCw, label: "Replenishment", href: "/replenishment" },
  { icon: CheckSquare, label: "Approval", href: "/approval", badge: 12 },
];

const secondaryMenuItems = [
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
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 z-20",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white text-lg font-bold">U</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-base text-slate-900 tracking-tight">JUARA</span>
                <span className="text-sm text-primary font-medium">PettyCash</span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center mx-auto">
              <span className="text-white text-lg font-bold">U</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
          <p className={cn("text-[10px] font-bold text-slate-400 mb-3 px-2 uppercase tracking-wider", !sidebarOpen && "hidden")}>TRANSAKSI</p>
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.label} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
                    isActive
                      ? "bg-blue-50 text-primary font-semibold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} />
                  {sidebarOpen && (
                    <span className="flex-1 text-sm">{item.label}</span>
                  )}
                  {sidebarOpen && item.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          <div className="my-6 border-t border-slate-100" />
          
          <p className={cn("text-[10px] font-bold text-slate-400 mb-3 px-2 uppercase tracking-wider", !sidebarOpen && "hidden")}>SISTEM</p>
          {secondaryMenuItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-slate-500 hover:bg-slate-50 hover:text-slate-900 group">
                <item.icon className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </div>
            </Link>
          ))}
        </div>

        {/* User Profile in Sidebar Bottom */}
        <div className="p-4 border-t border-slate-100 m-2 rounded-xl bg-slate-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer p-1 transition-colors">
                <Avatar className="h-10 w-10 bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                  <AvatarFallback className="bg-green-600 text-white">
                    {user?.name?.substring(0, 2).toUpperCase() || 'BS'}
                  </AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate text-slate-900">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.position}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.division}</p>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" /> Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Dark Blue Header */}
        <div className="md:hidden bg-primary text-white h-16 flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-primary">
              <span className="text-lg font-bold">U</span>
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
            <Avatar className="h-8 w-8 cursor-pointer bg-green-600 text-white flex items-center justify-center font-bold text-xs" onClick={() => signOut()}>
              <AvatarFallback className="bg-green-600 text-white border border-white">
                {user?.name?.substring(0, 2).toUpperCase() || 'BS'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Desktop Topbar */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 bg-white border-b border-slate-200 z-10 sticky top-0">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-slate-500">
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Cari menu, transaksi, atau dokumen..." 
                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-md h-9 text-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <kbd className="inline-flex items-center gap-1 px-1.5 font-sans text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded">⌘K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer text-slate-600 hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                8
              </span>
            </div>
            <HelpCircle className="w-5 h-5 text-slate-600 cursor-pointer hover:text-primary transition-colors" />
            
            <div className="flex items-center gap-2 pl-5 border-l border-slate-200 cursor-pointer">
              <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                <span className="text-[10px] font-bold text-slate-600">🏢</span>
              </div>
              <span className="text-sm font-semibold text-slate-700">JEF GROUP ID</span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-400"><path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95013 7.49999 9.95013C7.38064 9.95013 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 md:pb-8 scroll-smooth">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 py-2 safe-area-bottom pb-6">
        <div className="flex justify-between items-center px-4">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-primary">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-medium">Dashboard</span>
          </Link>
          
          <Link href="/pengeluaran" className="flex flex-col items-center gap-1 text-slate-400">
            <Receipt className="w-5 h-5" />
            <span className="text-[10px] font-medium">Transaksi</span>
          </Link>

          {/* Floating Action Button Center */}
          <Link href="/pengajuan/baru" className="relative -top-5">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/40 border-4 border-slate-50">
              <span className="text-2xl font-light leading-none">+</span>
            </div>
          </Link>

          <Link href="/approval" className="flex flex-col items-center gap-1 text-slate-400 relative">
            <CheckSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0 rounded-full">
              12
            </span>
            <span className="text-[10px] font-medium">Approval</span>
          </Link>

          <Link href="#menu" className="flex flex-col items-center gap-1 text-slate-400">
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium">Menu</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
