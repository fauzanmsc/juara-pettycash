"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, LayoutDashboard, Receipt, FileText, CheckSquare, RefreshCw, Settings, History, Tags, Wallet, ArrowLeftRight } from "lucide-react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <div 
        className="hidden md:flex items-center relative w-72 lg:w-96 transition-all group cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Search strokeWidth={2.5} className="w-[18px] h-[18px] absolute left-3.5 text-slate-500 dark:text-slate-400 stroke-[2.5] group-hover:text-emerald-600 dark:group-hover:text-[#B2F082] transition-colors pointer-events-none" />
        <div 
          className="w-full bg-slate-100/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 group-hover:bg-white dark:group-hover:bg-white/10 group-hover:border-emerald-500/50 dark:group-hover:border-[#B2F082]/50 text-[14px] font-medium text-slate-500 dark:text-slate-400 rounded-[14px] pl-11 pr-3 py-2 transition-all shadow-sm flex items-center justify-between"
        >
          <span className="tracking-tight">Cari data, menu, atau akses...</span>
          <kbd className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-500 dark:text-slate-300 shadow-sm font-sans tracking-widest">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>
      
      <CommandDialog 
        open={open}
        overlayClassName="bg-black/30 backdrop-blur-sm dark:bg-black/50" 
        onOpenChange={setOpen} 
        className="max-w-[550px] p-0 rounded-[24px] border border-slate-200/60 dark:border-white/10 shadow-2xl dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden bg-white/95 dark:bg-[#111318]/95 backdrop-blur-3xl top-[20%] translate-y-0"
      >
        <Command className="bg-transparent border-0 outline-none w-full">
          <CommandInput 
            placeholder="Ketik untuk mencari menu atau data..." 
            className="border-0 focus:ring-0 focus-visible:ring-0 shadow-none outline-none h-14 text-[16px] px-4" 
          />
          <CommandList className="max-h-[60vh] sm:max-h-[400px]">
            <CommandEmpty className="py-10 text-center text-slate-500">Tidak ada hasil yang ditemukan.</CommandEmpty>
            <CommandGroup heading="Transaksi" className="p-2">
              <CommandItem onSelect={() => runCommand(() => router.push("/pengajuan"))} className="rounded-xl px-4 py-3 cursor-pointer">
                <FileText className="mr-3 h-5 w-5 text-slate-400" />
                <span className="text-[15px] font-medium">Pengajuan Dana</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/transaksi"))} className="rounded-xl px-4 py-3 cursor-pointer">
                <ArrowLeftRight className="mr-3 h-5 w-5 text-slate-400" />
                <span className="text-[15px] font-medium">Transaksi Kas</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/settlement"))} className="rounded-xl px-4 py-3 cursor-pointer">
                <CheckSquare className="mr-3 h-5 w-5 text-slate-400" />
                <span className="text-[15px] font-medium">Settlement</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/replenishment"))} className="rounded-xl px-4 py-3 cursor-pointer">
                <RefreshCw className="mr-3 h-5 w-5 text-slate-400" />
                <span className="text-[15px] font-medium">Replenishment</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/approval"))} className="rounded-xl px-4 py-3 cursor-pointer text-emerald-600 dark:text-[#B2F082] bg-emerald-50/50 dark:bg-emerald-900/10">
                <CheckSquare className="mr-3 h-5 w-5" />
                <span className="font-semibold text-[15px]">Approval</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator className="bg-slate-100 dark:bg-white/5" />
            <CommandGroup heading="Sistem & Master Data" className="p-2">
              <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))} className="rounded-xl px-4 py-3 cursor-pointer">
                <LayoutDashboard className="mr-3 h-5 w-5 text-slate-400" />
                <span className="text-[15px] font-medium">Dashboard Utama</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/jurnal"))} className="rounded-xl px-4 py-3 cursor-pointer">
                <Wallet className="mr-3 h-5 w-5 text-slate-400" />
                <span className="text-[15px] font-medium">Jurnal Keuangan</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/master/kategori"))} className="rounded-xl px-4 py-3 cursor-pointer">
                <Tags className="mr-3 h-5 w-5 text-slate-400" />
                <span className="text-[15px] font-medium">Master Kategori</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/audit"))} className="rounded-xl px-4 py-3 cursor-pointer">
                <History className="mr-3 h-5 w-5 text-slate-400" />
                <span className="text-[15px] font-medium">Audit Trail</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push("/pengaturan"))} className="rounded-xl px-4 py-3 cursor-pointer">
                <Settings className="mr-3 h-5 w-5 text-slate-400" />
                <span className="text-[15px] font-medium">Pengaturan Akun</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
