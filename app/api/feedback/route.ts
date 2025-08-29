import { NextRequest } from "next/server";
import { getGeminiFeedback } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { question, answer } = await req.json();
    if (!question || !answer) {
      return new Response("Question and answer required", { status: 400 });
    }
    const feedback = await getGeminiFeedback(question, answer);
    return Response.json({ feedback });
  } catch (e: any) {
    console.error("Gemini feedback error:", e);
    return new Response(
      "Failed to get AI feedback. " +
        (e.message ? "\n" + e.message : ""),
      { status: 500 }
    );
  }
}
