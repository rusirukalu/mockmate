// scripts/fetchQuestions.ts
import { prisma } from "@/lib/prisma";

// Fetch from LeetCode API
export async function fetchLeetCodeQuestions() {
  const res = await fetch("https://leetcode.com/api/problems/all/");
  if (!res.ok) throw new Error("Failed to fetch LeetCode questions");
  const data = await res.json();

  const difficultyMap: Record<number, string> = {
    1: "Easy",
    2: "Medium",
    3: "Hard",
  };

  const leetcodeQs = data.stat_status_pairs.slice(0, 50).map((q: any) => ({
    text: q.stat.question__title,
    category: "Technical",
    difficulty: difficultyMap[q.difficulty.level] || "Medium",
    source: "leetcode",
    url: `https://leetcode.com/problems/${q.stat.question__title_slug}/`,
  }));

  // Store in DB
  if (leetcodeQs.length > 0) {
    await prisma.question.createMany({
      data: leetcodeQs,
      skipDuplicates: true,
    });
  }

  return leetcodeQs;
}

// Allow running manually with `pnpm tsx scripts/fetchQuestions.ts`
if (require.main === module) {
  fetchLeetCodeQuestions()
    .then((res) => {
      console.log(`✅ Inserted ${res.length} LeetCode questions`);
    })
    .catch((err) => {
      console.error("LeetCode fetch failed:", err);
      process.exit(1);
    });
}
