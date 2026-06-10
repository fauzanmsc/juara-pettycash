"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API Call for registration
    setTimeout(() => {
      setLoading(false);
      toast.success("Registrasi Berhasil", {
        description: "Akun Anda telah berhasil dibuat. Silakan login.",
      });
      router.push("/login");
    }, 1500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 py-12">
      <Card className="w-full max-w-md glass-card border-none shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Buat Akun Baru
          </CardTitle>
          <CardDescription>
            Lengkapi data di bawah ini untuk mendaftar Juara PettyCash.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Avatar Upload */}
            <div className="flex flex-col items-center justify-center space-y-4 mb-6">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400">
                <AvatarImage src={avatar || "/images/default-avatar.png"} className="object-cover object-top" />
                <AvatarFallback className="bg-transparent text-white text-2xl font-bold">
                  {"BS"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Label
                  htmlFor="avatar"
                  className="cursor-pointer flex items-center gap-2 text-sm text-primary font-medium px-4 py-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Pilih Foto Profil
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" placeholder="John Doe" required className="bg-white/50 dark:bg-black/20" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@jefgroup.com" required className="bg-white/50 dark:bg-black/20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="division">Divisi</Label>
                <Input id="division" placeholder="Finance" required className="bg-white/50 dark:bg-black/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Jabatan</Label>
                <Input id="position" placeholder="Staff" required className="bg-white/50 dark:bg-black/20" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required className="bg-white/50 dark:bg-black/20" />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 mt-4" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mendaftarkan...
                </>
              ) : (
                "Daftar Akun"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Sudah punya akun? </span>
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
