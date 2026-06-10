import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/90 dark:bg-[#070D07]/90 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-white dark:bg-[#151921] border border-slate-100 dark:border-slate-800 shadow-2xl">
        <div className="flex flex-col items-center justify-center">
          <Image src="/images/logo-jpc-lightmode.svg" alt="Juara PettyCash" width={160} height={45} className="dark:hidden mb-6" priority />
          <Image src="/images/logo-jpc-darkmode.svg" alt="Juara PettyCash" width={160} height={45} className="hidden dark:block mb-6" priority />
        </div>
        
        <div className="relative w-16 h-16">
          {/* Tech Loader Animation */}
          <div className="absolute inset-0 border-4 border-[#B2F082]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#B2F082] rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 border-4 border-[#0F3D29]/20 dark:border-[#B2F082]/10 rounded-full"></div>
          <div className="absolute inset-2 border-4 border-[#0F3D29] dark:border-[#B2F082]/60 rounded-full border-b-transparent animate-[spin_1.5s_reverse_linear_infinite]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-[#B2F082] rounded-full animate-pulse shadow-[0_0_15px_#B2F082]"></div>
          </div>
        </div>
        
        <p className="text-sm font-semibold text-[#0F3D29] dark:text-[#B2F082] animate-pulse tracking-widest uppercase mt-2">
          Memuat Sistem...
        </p>
      </div>
    </div>
  );
}
