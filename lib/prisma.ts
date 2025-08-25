// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

declare global {
  // Allow global `prisma` to avoid multiple instantiations in dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  })

if (process.env.NODE_ENV !== "production") global.prisma = prisma
