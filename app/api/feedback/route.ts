// app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getGeminiFeedback } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { question, answer } = await req.json();
    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer required" },
        { status: 400 }
      );
    }
    const feedback = await getGeminiFeedback(question, answer);
    return NextResponse.json({ feedback });
  } catch (e: any) {
    console.error("Gemini feedback error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to get AI feedback" },
      { status: 500 }
    );
  }
}
