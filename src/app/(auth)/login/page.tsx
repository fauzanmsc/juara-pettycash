"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-[#0D0F14]">
      {/* Left Side - Illustration (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 relative bg-primary overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 800">
            <path fill="url(#grad1)" d="M0,0 L1440,0 L1440,800 L0,800 Z"></path>
            <path fill="rgba(255,255,255,0.05)" d="M0,400 Q360,200 720,400 T1440,400 L1440,800 L0,800 Z"></path>
            <path fill="rgba(255,255,255,0.02)" d="M0,600 Q360,400 720,600 T1440,600 L1440,800 L0,800 Z"></path>
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" /> {/* blue-900 */}
                <stop offset="100%" stopColor="#0640b7" /> {/* primary */}
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="z-10 flex flex-col justify-center px-16 xl:px-24 text-white w-full">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-xl">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Kelola Kas Kecil <br /> Lebih Pintar & Terpusat.
          </h1>
          <p className="text-blue-100 text-lg max-w-lg leading-relaxed">
            Sistem manajemen *petty cash* terintegrasi untuk JEF Group. 
            Ajukan, pantau, dan setujui pengeluaran hanya dalam hitungan detik.
          </p>

          {/* Testimonial / Features mockup */}
          <div className="mt-16 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl max-w-md">
            <div className="flex gap-4 items-center">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-400 border-2 border-primary"></div>
                <div className="w-10 h-10 rounded-full bg-indigo-400 border-2 border-primary"></div>
                <div className="w-10 h-10 rounded-full bg-teal-400 border-2 border-primary"></div>
              </div>
              <div>
                <p className="text-sm font-semibold">Dipercaya oleh seluruh divisi</p>
                <p className="text-xs text-blue-200">100+ Transaksi per hari</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-8 z-10 relative">
        <div className="w-full max-w-md bg-white dark:bg-[#151921] rounded-3xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all">
          
          <div className="flex justify-center mb-8 lg:hidden">
             <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">U</span>
              </div>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Selamat Datang!</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Masukkan email korporat Anda untuk mengakses dashboard JEF PettyCash.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">Email Korporat</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@jefgroup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-slate-50 dark:bg-[#0D0F14] border-slate-200 dark:border-slate-800 focus-visible:ring-primary dark:focus-visible:ring-primary/50 text-slate-900 dark:text-white transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">Password</Label>
                <a href="#" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">Lupa Password?</a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10 bg-slate-50 dark:bg-[#0D0F14] border-slate-200 dark:border-slate-800 focus-visible:ring-primary dark:focus-visible:ring-primary/50 text-slate-900 dark:text-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30 text-center font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Masuk ke Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Butuh bantuan akses? <a href="#" className="font-semibold text-slate-900 dark:text-white hover:underline">Hubungi IT Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
