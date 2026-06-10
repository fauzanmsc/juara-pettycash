import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/90 dark:bg-[#070D07]/90 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-white dark:bg-[#151921] border border-slate-100 dark:border-slate-800 shadow-2xl">
        <div className="flex flex-col items-center justify-center">
          <Image src="/images/logo-jpc-lightmode.svg" alt="Juara PettyCash" width={160} height={45} className="dark:hidden mb-6" priority />
          <Image src="/images/logo-jpc-darkmode.svg" alt="Juara PettyCash" width={160} height={45} className="hidden dark:block mb-6" priority />
        </div>
        
        <div className="relative w-20 h-20 mb-2">
          {/* Simple Circular Loader */}
          <div className="absolute inset-0 border-[5px] border-[#B2F082]/20 rounded-full"></div>
          <div className="absolute inset-0 border-[5px] border-[#B2F082] rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Image src="/images/logomark-light.svg" alt="Logo" width={32} height={32} className="dark:hidden animate-pulse" />
            <Image src="/images/logomark-dark.svg" alt="Logo" width={32} height={32} className="hidden dark:block animate-pulse" />
          </div>
        </div>
        
        <p className="text-sm font-semibold text-[#0F3D29] dark:text-[#B2F082] animate-pulse tracking-widest uppercase mt-2">
          Memuat Sistem...
        </p>
      </div>
    </div>
  );
}
