// Survey questions: docs/05 section D. Values MUST match apps/api/src/schemas/survey-options.ts.
export type Question = { key: string; label: string; type: "single" | "multi" | "text"; options?: [string, string][]; only?: (a: Answers) => boolean; max?: number };
export type Answers = Record<string, string | string[]>;

export const QUESTIONS: Question[] = [
  { key: "year", label: "What year are you in?", type: "single", options: [["1", "1st year"], ["2", "2nd year"], ["3", "3rd year"], ["4plus", "4th year or above"], ["pg", "Postgraduate"], ["other", "Other"]] },
  { key: "distractingApps", label: "Which apps distract you most?", type: "multi", options: [["instagram", "Instagram"], ["youtube", "YouTube"], ["whatsapp", "WhatsApp"], ["snapchat", "Snapchat"], ["x", "X (Twitter)"], ["reddit", "Reddit"], ["games", "Games"], ["short_video", "Short-video apps"], ["other", "Other"]] },
  { key: "loseFocusWhen", label: "When do you lose focus most?", type: "multi", options: [["morning", "Morning"], ["afternoon", "Afternoon"], ["evening", "Evening"], ["late_night", "Late night"], ["after_classes", "After classes"], ["before_exams", "Before exams"], ["other", "Other"]] },
  { key: "stopwatchOrTimer", label: "Do you prefer a stopwatch or a timer?", type: "single", options: [["stopwatch", "Stopwatch"], ["timer", "Timer"], ["both", "Both"], ["unsure", "Not sure"]] },
  { key: "pricePerMonth", label: "What would you pay per month for Pro?", type: "single", options: [["nothing", "Nothing, I’d stay on free"], ["under_coffee", "Under the price of one coffee"], ["one_coffee", "About one coffee"], ["two_coffees", "About two coffees"], ["more", "More than that"]] },
  { key: "deleteReason", label: "What would make you delete this app?", type: "text", max: 300 },
  { key: "platform", label: "Which phone do you use?", type: "single", options: [["android", "Android"], ["iphone", "iPhone"], ["both", "Both"]] },
  { key: "phoneBrand", label: "What is your phone brand?", type: "single", only: (a) => a.platform === "android" || a.platform === "both",
    options: [["samsung", "Samsung"], ["xiaomi", "Xiaomi/Redmi/Poco"], ["realme", "Realme"], ["oneplus", "OnePlus"], ["oppo", "Oppo"], ["vivo", "Vivo"], ["motorola", "Motorola"], ["pixel", "Google Pixel"], ["other", "Other"]] },
  { key: "betaInterest", label: "Would you like to try the closed beta?", type: "single", options: [["yes", "Yes, I’m interested"], ["maybe", "Maybe later"], ["no", "No thanks"]] },
];

/** Only answered questions are sent (every question is optional). */
export function cleanAnswers(a: Answers): Answers {
  const out: Answers = {};
  for (const q of QUESTIONS) {
    if (q.only && !q.only(a)) continue;
    const v = a[q.key];
    if (Array.isArray(v) ? v.length : typeof v === "string" && v.trim()) out[q.key] = typeof v === "string" ? v.trim() : v;
  }
  return out;
}
