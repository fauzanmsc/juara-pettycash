import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-key-jef-pettycash-2026",
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/pengajuan/:path*",
    "/pengeluaran/:path*",
    "/settlement/:path*",
    "/replenishment/:path*",
    "/approval/:path*",
    "/master/:path*",
    "/audit/:path*",
    "/pengaturan/:path*",
  ],
};
