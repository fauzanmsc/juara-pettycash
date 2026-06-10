import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@jefgroup.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(process.env.NEXT_PUBLIC_GAS_URL as string, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'login',
              email: credentials.email,
              password: credentials.password
            })
          });

          const response = await res.json();

          if (response.success && response.data) {
            const user = response.data;
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              division: user.division,
              position: user.position,
              // Use avatar from GAS backend or fallback
              image: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
            } as any;
          } else {
            console.error("Login failed:", response.error?.message);
            return null;
          }
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.division = (user as any).division;
        token.position = (user as any).position;
        token.picture = user.image;
      }
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
        if (session.image) token.picture = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).division = token.division;
        (session.user as any).position = token.position;
        session.user.image = token.picture as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-key-jef-pettycash-2026",
});

export { handler as GET, handler as POST };
