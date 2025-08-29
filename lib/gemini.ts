// lib/gemini.ts
export async function getGeminiFeedback(question: string, answer: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  `You're an expert interview coach. Here's the question:\n"${question}"\n\nAnswer:\n"${answer}"\n\nProvide feedback as markdown bullets. Say what was done well and what could be improved.`
              }
            ]
          }
        ]
      })
    }
  );

  const data = await res.json();
  // Defensive parsing (API may change format)
  const feedback =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    data?.candidates?.[0]?.output ??
    "No feedback.";

  return feedback;
}
