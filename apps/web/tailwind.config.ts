import type { Config } from "tailwindcss";

// Colours point at the CSS variables in src/app/globals.css, so there is ONE place to change them.
// Preflight (Tailwind's reset) is off: our own reset in globals.css matches the approved prototype exactly.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)", surface: "var(--surface)", "surface-2": "var(--surface-2)", border: "var(--border)",
        navy: "var(--navy)", ink: "var(--text)", muted: "var(--muted)",
        amber: "var(--amber)", orange: "var(--orange)", accent: "var(--accent)",
      },
      fontFamily: { sans: ["var(--font)"] },
    },
  },
  plugins: [],
};
export default config;
