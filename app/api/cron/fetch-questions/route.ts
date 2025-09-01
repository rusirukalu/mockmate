import { NextResponse } from "next/server";
import { fetchLeetCodeQuestions } from "@/scripts/fetchQuestions";
import { fetchGithubQuestions } from "@/scripts/fetchGithubQuestions";

export async function GET() {
  try {
    // Run both pipelines
    const leet = await fetchLeetCodeQuestions();
    const gh = await fetchGithubQuestions();

    return NextResponse.json({
      ok: true,
      message: "Questions refreshed",
      leet: leet.length,
      github: gh.length,
    });
  } catch (err: unknown) {
    console.error("Cron job failed:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to refresh" },
      { status: 500 }
    );
  }
}
