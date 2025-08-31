export const TIMER_BY_DIFFICULTY: Record<string, number> = {
  Easy: parseInt(process.env.NEXT_PUBLIC_TIMER_EASY || "60", 10),
  Medium: parseInt(process.env.NEXT_PUBLIC_TIMER_MEDIUM || "120", 10),
  Hard: parseInt(process.env.NEXT_PUBLIC_TIMER_HARD || "180", 10),
};
