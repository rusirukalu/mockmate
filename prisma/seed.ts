import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await prisma.question.createMany({
    data: [
      {text: "Tell me about yourself.", category: "Behavioral", difficulty: "Easy", type: "behavioral"},
      {text: "Describe a technical challenge you faced.", category: "Technical", difficulty: "Medium", type: "technical"},
      // Add more
    ]
  })
}
main().finally(() => prisma.$disconnect())
