"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email atau password salah.");
        setIsLoading(false);
      } else {
        setIsSuccessModalOpen(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex relative items-center justify-center lg:justify-end lg:px-32 p-6 overflow-hidden bg-[#070D07]">
      {/* Full Screen Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-30 mix-blend-luminosity" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F3D29]/95 via-[#0F3D29]/80 to-[#B2F082]/10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[#070D07]/50 dark:bg-[#070D07]/80" /> {/* Dimmer */}
        
        {/* Decorative blur orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#B2F082] rounded-full mix-blend-overlay filter blur-[150px] opacity-30 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[10%] w-[40vw] h-[40vw] bg-[#0F3D29] rounded-full mix-blend-overlay filter blur-[150px] opacity-80" />
      </div>

      {/* Left Side Content - Fixed to left in desktop */}
      <div className="hidden lg:flex flex-col justify-center absolute left-0 top-0 bottom-0 w-1/2 px-24 z-10 pointer-events-none">
        <div className="mb-12">
          <img src="/images/logo-jpc-darkmode.svg" alt="Juara PettyCash" className="h-20 drop-shadow-2xl" />
        </div>
        <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-8 drop-shadow-lg">
          Kelola Kas Kecil <br /> <span className="text-[#B2F082]">Dengan Lebih Mudah.</span>
        </h1>
        <p className="text-slate-200 text-lg max-w-md leading-relaxed drop-shadow-md">
          Platform pengelolaan kas kecil resmi JEF Group. Nikmati kemudahan dalam mengajukan, memantau, dan menyetujui anggaran harian secara terpusat.
        </p>
      </div>

      {/* Right Side - Login Form (Glass Card) */}
      <div className="w-full max-w-[460px] z-10 relative">
        {/* Mobile Logo */}
        <div className="flex justify-center mb-10 lg:hidden">
          <img src="/images/logo-jpc-darkmode.svg" alt="Juara PettyCash" className="h-16 drop-shadow-xl" />
        </div>

        <div className="bg-white/10 dark:bg-[#151921]/60 backdrop-blur-2xl rounded-[2.5rem] p-10 sm:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] border border-white/20 dark:border-white/10 transition-all relative overflow-hidden">
          {/* subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

          <div className="text-center lg:text-left mb-10 relative z-10">
            <h2 className="text-3xl font-bold text-white tracking-tight">Masuk ke Akun</h2>
            <p className="text-slate-300 dark:text-slate-400 mt-2 text-sm">Gunakan kredensial perusahaan Anda untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200 font-medium ml-1">Email Korporat</Label>
              <Input
                id="email"
                type="email"
                placeholder="contoh: nama@jefgroup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-[#B2F082] focus-visible:border-[#B2F082] rounded-2xl backdrop-blur-md transition-all px-5 text-base"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="password" className="text-slate-200 font-medium">Password</Label>
                <a href="#" className="text-xs font-semibold text-[#B2F082] hover:text-[#B2F082]/80 transition-colors">Lupa Password?</a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-[#B2F082] focus-visible:border-[#B2F082] rounded-2xl backdrop-blur-md transition-all px-5 pr-12 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 text-red-200 text-sm rounded-2xl border border-red-500/20 text-center font-medium backdrop-blur-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 mt-4 text-[15px] font-bold shadow-[0_0_20px_rgba(178,240,130,0.3)] hover:shadow-[0_0_30px_rgba(178,240,130,0.5)] bg-[#B2F082] hover:bg-[#9ee16d] text-[#0F3D29] transition-all duration-300 group rounded-2xl border-0"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Masuk ke Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center relative z-10">
            <p className="text-xs text-slate-400">
              Butuh bantuan akses? <a href="#" className="font-semibold text-white hover:text-[#B2F082] transition-colors">Hubungi IT Support</a>
            </p>
          </div>
        </div>
      </div>

      {/* Login Success Modal / Tech Loader */}
      <Dialog open={isSuccessModalOpen} onOpenChange={() => {}}>
        <DialogContent 
          overlayClassName="bg-[#070D07]/80 backdrop-blur-xl"
          className="sm:max-w-[340px] p-0 border border-[#B2F082]/20 bg-[#151921]/90 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(178,240,130,0.1)] [&>button]:hidden"
        >
          <div className="p-10 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[#B2F082]/5 blur-3xl opacity-50"></div>
            <div className="relative w-24 h-24 mb-8">
              {/* Retina ready tech loader */}
              <div className="absolute inset-0 border-4 border-[#B2F082]/20 rounded-full shadow-[inset_0_0_15px_rgba(178,240,130,0.1)]"></div>
              <div className="absolute inset-0 border-4 border-[#B2F082] rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 border-4 border-[#0F3D29]/20 dark:border-[#B2F082]/10 rounded-full"></div>
              <div className="absolute inset-2 border-4 border-[#0F3D29] dark:border-[#B2F082]/60 rounded-full border-b-transparent animate-[spin_1.5s_reverse_linear_infinite]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[#B2F082] rounded-full animate-pulse shadow-[0_0_20px_#B2F082]"></div>
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-white mb-2 tracking-tight relative z-10">Authenticating...</h2>
            <p className="text-[#B2F082] text-[10px] font-bold animate-pulse uppercase tracking-widest relative z-10">Initializing Secure Session</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
