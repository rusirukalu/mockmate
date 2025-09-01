// scripts/fetchGithubQuestions.ts
import { prisma } from "@/lib/prisma";

// Utility: extract lines that look like questions
function extractQuestionsFromMarkdown(md: string): string[] {
  return md
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.endsWith("?") && line.length > 10);
}

async function fetchMarkdownFile(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return await res.text();
}

export async function fetchGithubQuestions() {
  // System Design Primer
  const systemDesignMD = await fetchMarkdownFile(
    "https://raw.githubusercontent.com/donnemartin/system-design-primer/master/README.md"
  );
  const systemDesignQs = extractQuestionsFromMarkdown(systemDesignMD).map((q) => ({
    text: q,
    category: "System Design",
    difficulty: "Hard",
    source: "system-design-primer",
    url: "https://github.com/donnemartin/system-design-primer",
  }));

  // Awesome Interview Questions (Behavioral)
  const behavioralMD = await fetchMarkdownFile(
    "https://raw.githubusercontent.com/DopplerHQ/awesome-interview-questions/master/README.md"
  );
  const behavioralQs = extractQuestionsFromMarkdown(behavioralMD).map((q) => ({
    text: q,
    category: "Behavioral",
    difficulty: "Medium",
    source: "awesome-interview-questions",
    url: "https://github.com/DopplerHQ/awesome-interview-questions",
  }));

  const all = [...systemDesignQs, ...behavioralQs];

  if (all.length > 0) {
    await prisma.question.createMany({
      data: all,
      skipDuplicates: true,
    });
  }

  return all;
}

// Allow running manually
if (require.main === module) {
  fetchGithubQuestions()
    .then((res) => {
      console.log(`✅ Inserted ${res.length} GitHub questions`);
    })
    .catch((err) => {
      console.error("GitHub fetch failed:", err);
      process.exit(1);
    });
}
