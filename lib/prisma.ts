import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["warn", "error"],
    errorFormat: "pretty",
  })

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}
