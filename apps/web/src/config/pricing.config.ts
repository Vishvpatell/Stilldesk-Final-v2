/**
 * Free vs Pro: ONE place for plan facts, taken from docs/03 section 11 and the Master Plan section 5.
 * Rules from the docs: show NO price yet, and NO specific free blocked-app number ("a few apps").
 * To turn prices on later: set showPrices to true and fill PRO_PRICE_* in site.config.ts.
 * Nothing here is invented: every row below is from the approved comparison table.
 */
export const pricing = {
  showPrices: false, // docs/02: "Comparison table. No price." Flip only after the waitlist survey decides prices.
  proStatus: "After launch",
  priceLine: "The Pro price will be announced at launch.",
  trialLine: "People on the waitlist get an early-bird offer and a 7-day Pro trial.",
  footnote: "Planned features may change before release.",
} as const;

export type PlanRow = { label: string; free: string; pro: string; same?: boolean; meter?: boolean };
export type PlanGroup = { title: string; rows: PlanRow[] };

export const planGroups: PlanGroup[] = [
  { title: "Plan", rows: [
    { label: "First-open setup and subjects", free: "Yes", pro: "Yes", same: true },
    { label: "Brain-dump bar (AI)", free: "10 a day", pro: "Unlimited", meter: true },
    { label: "Today screen and tasks", free: "Yes", pro: "Yes", same: true },
  ] },
  { title: "Study", rows: [
    { label: "Arrival prompt", free: "Yes", pro: "Yes", same: true },
    { label: "Stopwatch, timer, 90-minute deep work", free: "Yes", pro: "Yes", same: true },
    { label: "Session blocking", free: "A few apps", pro: "Unlimited apps, plus optional strict mode" },
    { label: "End anytime and emergency snooze", free: "Yes", pro: "Yes", same: true },
    { label: "Breaks and break tags", free: "Yes", pro: "Plus weekly break insights" },
  ] },
  { title: "Understand", rows: [
    { label: "Stats", free: "Today, and this week by subject", pro: "Full colour charts, best focus time, monthly goals, CSV export" },
    { label: "Streak, freeze day, day reset", free: "Yes", pro: "Yes", same: true },
    { label: "Habit tracker", free: "3 habits", pro: "Unlimited" },
    { label: "Exam mode", free: "No", pro: "Yes" },
  ] },
  { title: "Together and everywhere", rows: [
    { label: "Private groups", free: "Planned: up to 4 friends", pro: "Planned: up to 20" },
    { label: "Public rooms", free: "Join", pro: "Join and create" },
    { label: "Sync across devices", free: "No", pro: "Yes" },
    { label: "Themes and sounds", free: "Basic", pro: "Extra" },
  ] },
];

/**
 * PROPOSED COPY (needs the owner's approval): a plain-words summary built ONLY from the table above,
 * so visitors can see why someone might choose Pro, without pressure.
 */
export const whyChoose = {
  free: "Free is enough if you want to capture plans, get the arrival prompt, study with a stopwatch, timer or deep work block, and block a few apps.",
  pro: "Pro is for people who want more: unlimited brain-dumps and blocked apps, fuller stats, exam mode, and sync across devices.",
};
