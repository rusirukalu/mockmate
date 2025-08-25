import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? ""
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER ?? "",
      from: process.env.EMAIL_FROM ?? ""
    })
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }