import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");

  const where: Record<string, string> = {};
  if (category && category !== "any") where.category = category;
  if (difficulty && difficulty !== "any") where.difficulty = difficulty;

  const questions = await prisma.question.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return Response.json(questions);
}
