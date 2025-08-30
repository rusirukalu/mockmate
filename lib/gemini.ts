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
`You are a seasoned mock interview coach.
Provide detailed feedback for this candidate's answer.

Question:
${question}

Candidate Answer:
${answer}

Return as markdown:

## Strengths
- List 1-3 things done well.

## Areas to Improve
- List 1-3 things that could be better.

## Sample Answer
- (Give one brief model response, in 2-5 sentences, suitable for a human interviewer.)

If the answer is very incomplete, give gentle advice and show a full sample.`
              }
            ]
          }
        ]
      })
    }
  );

  const data = await res.json();
  const feedback =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    data?.candidates?.[0]?.output ??
    "No feedback.";

  return feedback;
}
