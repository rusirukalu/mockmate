// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

declare global {
  // allow global `prisma` in dev to avoid multiple instantiations on hot reload
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["warn", "error"], // keep only warnings & errors (no query spam)
    errorFormat: "pretty",  // nicer stack traces on Prisma errors
  })

// ensure singleton in dev
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}
