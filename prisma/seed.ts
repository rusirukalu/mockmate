import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.question.createMany({
    data: [
      {
        text: "Tell me about yourself.",
        category: "Behavioral",
        difficulty: "Easy",
        source: "seed",
      },
      {
        text: "Describe a technical challenge you faced.",
        category: "Technical",
        difficulty: "Medium",
        source: "seed",
      },
      {
        text: "Explain a complex system you designed.",
        category: "System Design",
        difficulty: "Hard",
        source: "seed",
      },
    ],
    skipDuplicates: true,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
