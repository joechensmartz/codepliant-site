import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "ink": "var(--ink)",
        "ink-secondary": "var(--ink-secondary)",
        "ink-tertiary": "var(--ink-tertiary)",
        "surface-primary": "var(--surface-primary)",
        "surface-secondary": "var(--surface-secondary)",
        "surface-tertiary": "var(--surface-tertiary)",
        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",
        "brand": "var(--brand)",
        "brand-hover": "var(--brand-hover)",
        "brand-muted": "var(--brand-muted)",
        "urgency": "var(--urgency)",
        "urgency-muted": "var(--urgency-muted)",
        "code-bg": "var(--code-bg)",
        "code-fg": "var(--code-fg)",
      },
      fontFamily: {
        "display": "var(--font-outfit), system-ui, sans-serif",
        "body": "var(--font-source-sans), system-ui, sans-serif",
      },
    },
  },
  plugins: [],
};

export default config;
