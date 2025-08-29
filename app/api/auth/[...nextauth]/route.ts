import NextAuth, { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || "sandbox.smtp.mailtrap.io",
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER || "",
          pass: process.env.EMAIL_SERVER_PASS || "",
        },
      },
      from: process.env.EMAIL_FROM || "no-reply@example.com",
      maxAge: 10 * 60, // magic link valid 10 minutes
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/signup", // use our custom signup page
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Ensure users always go to dashboard after login
      if (url.startsWith(baseUrl)) return `${baseUrl}/dashboard`
      return `${baseUrl}/dashboard`
    },
  },

  logger: {
    error(code, metadata) {
      console.error("NEXTAUTH ERROR:", code, metadata)
    },
    warn(code) {
      console.warn("NEXTAUTH WARNING:", code)
    },
    // removed debug() to cut down noise
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
