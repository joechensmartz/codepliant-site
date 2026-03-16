# Design Research: Codepliant HTML Output

> 大道至简 — The great way is simple. Simplicity is the ultimate sophistication.

**Date:** 2026-03-15
**Scope:** UX research for Codepliant's generated compliance document pages

---

## 1. Apple.com/privacy Page Analysis

Apple's privacy page is the gold standard for making legal/compliance content feel human. Here is what it does differently from every other privacy page on the internet:

### What Apple does

- **It is a values statement, not a legal filing.** The hero says "Privacy. That's Apple." — not "Privacy Policy effective January 2024." The entire framing is emotional, not procedural.
- **Progressive disclosure everywhere.** Complex topics expand on demand. Nothing hits you all at once. The default state is calm.
- **Thematic grouping, not numbered clauses.** Sections have human names like "Our apps mind their business" instead of "Section 7.2(a) — Data Processing Activities."
- **Illustrations replace walls of text.** Custom SVG icons and animations communicate concepts (device security, data flow) visually. You understand before you read.
- **Massive whitespace.** 60-100px vertical gaps between sections. Content breathes. The page feels spacious, not dense.
- **Restrained color.** White background, near-black text, minimal accent color. The restraint itself communicates trustworthiness.
- **Typography drives hierarchy.** Hero text at 48-72px, section headers at 24-36px, body at 17-18px. The scale is generous. You never squint.
- **Centered column, max-width ~800-900px.** Text never stretches edge to edge. The reading experience is controlled.

### What Apple removes

- No cookie banners cluttering the page
- No sidebar navigation competing for attention
- No "accept all" dark patterns
- No dense legal numbering systems
- No small print — everything is the same readable size
- No visual clutter — every element earns its place

### Key takeaway

Apple treats privacy as a product feature, not a legal obligation. The page design reflects confidence and clarity. It says: "We have nothing to hide, so we made this beautiful."

---

## 2. What Users Actually Care About in Compliance Tools

### Research findings (from developer forums, G2/Capterra reviews, Reddit)

**The #1 thing: Speed.**
Developers want to go from zero to compliant in minutes, not months. AI-powered tools that achieve audit readiness in days are winning.

**The #2 thing: "Don't make me think."**
Developers are not lawyers. They want the tool to make decisions for them. The best tools scan, detect, and generate — no questionnaires, no configuration wizards, no 15-step forms.

**The #3 thing: Actually accurate output.**
Generated policies that are vague or generic destroy trust. Developers want documents that reflect their actual stack (which is exactly what Codepliant does with code scanning).

**The #4 thing: Clean output they are not embarrassed to ship.**
Multiple reviews mention that generated documents "look like they were made by a lawyer in 2005." Users want output they can put on their website without redesigning it.

**What users do NOT care about:**
- Fancy dashboards
- Compliance scores or gamification
- Enterprise features they will never use
- Branding on the generated documents

### Key takeaway for Codepliant

We already nail #1 (fast), #2 (no config needed), and #3 (code-based accuracy). The gap is #4 — the visual quality of our HTML output. The current design is competent but not remarkable. It needs to go from "fine" to "wow."

---

## 3. Current Codepliant HTML Output — What to Fix

### What we have now (from `src/output/html.ts`)

The current design is a sidebar + main content layout with:
- 14 CSS custom properties
- A fixed 280px sidebar
- System font stack
- line-height: 1.7
- max-width: 900px on main content
- Dark mode via prefers-color-scheme
- Mobile hamburger menu
- Print styles
- Table of contents per document

### What is wrong — through the lens of 大道至简

**1. The sidebar is unnecessary complexity.**
For a compliance page that might have 3-5 documents, a fixed sidebar is overkill. It eats 280px of screen real estate and creates a two-column layout that feels like a documentation site, not a clean legal page. Apple does not use sidebars on their privacy page.

**2. Too many CSS custom properties.**
14 variables for what should be a simple page. The design system is over-engineered for its purpose.

**3. The hamburger menu is a code smell.**
If you need a hamburger menu on a compliance page, the page is too complex.

**4. Border-bottom on headings adds visual noise.**
The `border-bottom: 2px solid` on h1 and `border-bottom: 1px solid` on h2 create horizontal lines that compete with the text hierarchy. Good typography does not need lines to create hierarchy — size and weight are enough.

**5. The TOC box with background color adds clutter.**
A box with a different background color (var(--bg-toc)) for each document's table of contents creates visual blocks that fragment the reading flow. Apple uses progressive disclosure instead.

**6. Too much going on.**
Tables, checklists, code blocks, blockquotes — all styled. For compliance documents, most of these are unnecessary. Simplify to what the generators actually output.

---

## 4. Recommended Design System for Codepliant HTML Output

### Philosophy

One column. Typography-driven. No chrome. The content IS the design.

### Font Stack

```css
font-family: "SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont,
  "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

Why: San Francisco is Apple's system font. Falls back gracefully. Do NOT use Inter (Impeccable warns it is overused). Do NOT use system-ui (inconsistent across languages/platforms).

### Core CSS Values

```css
:root {
  --text: #1d1d1f;          /* Apple's near-black — warmer than pure #000 */
  --text-secondary: #6e6e73; /* Apple's secondary gray */
  --bg: #ffffff;
  --bg-alt: #f5f5f7;        /* Apple's light gray background */
  --accent: #0066cc;        /* Accessible blue, Apple-style */
  --border: #d2d2d7;        /* Subtle dividers */
}

body {
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Helvetica, Arial, sans-serif;
  font-size: 17px;                 /* Apple's standard body size */
  line-height: 1.47059;            /* Apple's exact line-height for body */
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Layout

```css
.page {
  max-width: 680px;          /* Optimal reading width: ~65 characters */
  margin: 0 auto;
  padding: 80px 24px 120px;  /* Generous vertical breathing room */
}
```

Why 680px not 900px: The current 900px is too wide for comfortable reading. Research consistently shows 60-70 characters per line is optimal. At 17px with this font stack, 680px hits ~65 characters.

### Typography Scale

```css
h1 {
  font-size: 40px;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.015em;  /* Tighten at large sizes */
  margin-bottom: 16px;
}

h2 {
  font-size: 28px;
  line-height: 1.14286;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-top: 56px;          /* Major section break */
  margin-bottom: 12px;
}

h3 {
  font-size: 21px;
  line-height: 1.19048;
  font-weight: 600;
  margin-top: 40px;
  margin-bottom: 8px;
}

p {
  margin-bottom: 16px;
}

ul, ol {
  margin: 8px 0 16px 24px;   /* Not 1.5rem — precise pixel control */
}

li {
  margin-bottom: 6px;
}
```

### No borders on headings

Remove `border-bottom` from h1 and h2 entirely. Size and weight create hierarchy. Lines add noise.

### Dark Mode

```css
@media (prefers-color-scheme: dark) {
  :root {
    --text: #f5f5f7;
    --text-secondary: #a1a1a6;
    --bg: #000000;           /* True black like Apple */
    --bg-alt: #1d1d1f;
    --accent: #2997ff;       /* Apple's blue in dark mode */
    --border: #424245;
  }
}
```

### Print

```css
@media print {
  body {
    font-size: 11pt;
    line-height: 1.5;
    color: #000;
    background: #fff;
  }
  .page { max-width: 100%; padding: 0; }
  h1 { font-size: 18pt; }
  h2 { font-size: 14pt; }
}
```

---

## 5. What to Remove (大道至简 Applied)

### Remove from the HTML template

| Current Element | Action | Reason |
|---|---|---|
| Fixed sidebar with navigation | **Remove entirely** | Replace with a single-page flow. Use anchor links in a minimal top nav or just let users scroll. |
| Hamburger menu + JavaScript | **Remove entirely** | No sidebar means no hamburger. Zero JS needed. |
| Per-document TOC with `<details>` | **Remove** | For 3-5 documents, a TOC per section is overkill. One optional TOC at the top is enough. |
| `--bg-toc` background color | **Remove** | One less visual layer. |
| `--blockquote-bg` | **Remove** | Blockquotes need only a left border, not a background. |
| `--table-stripe` | **Remove** | Zebra-striping is visual noise for small tables. |
| `--shadow` | **Remove** | Not used effectively. Shadows are anti-minimal. |
| `border-bottom` on h1/h2 | **Remove** | Typography creates hierarchy, not lines. |
| `.table-wrapper` overflow | **Simplify** | Compliance docs rarely have wide tables. |
| Checkbox/checklist styling | **Keep but simplify** | AI checklist uses these. |

### Reduce CSS custom properties from 14 to 6

Keep only: `--text`, `--text-secondary`, `--bg`, `--bg-alt`, `--accent`, `--border`

### Remove from the overall experience

- **Remove "Legal & Compliance Documents" subtitle.** The content makes this obvious. Labeling it is redundant.
- **Remove the company name in a sidebar header.** Put it once at the top of the page, cleanly.
- **Remove visual separation between documents.** Use whitespace (56px margin-top on h2, 80px between major sections) instead of `border-bottom` dividers.

---

## 6. Impeccable Framework — Anti-Patterns to Avoid

From the Impeccable project (github.com/pbakaus/impeccable):

1. **Do not use Inter, Arial, or plain system-ui.** They are overused. Use the full Apple font stack with named fallbacks.
2. **Do not use pure black or pure gray without tinting.** Use Apple's warm near-black (#1d1d1f) and tinted grays (#6e6e73).
3. **Do not use card-based layouts, especially nested cards.** Our current TOC boxes are cards. Remove them.
4. **Do not use bounce/elastic easing.** Not relevant to us (we should have zero animations), but worth noting.
5. **Use OKLCH color space for better perceptual uniformity** (future enhancement).

---

## 7. What Would Make a User Say "Wow, This Is So Clean"

1. **Opening the HTML file and seeing nothing but beautiful typography on a white page.** No sidebar. No boxes. No chrome. Just the words, perfectly set.

2. **The reading experience feels like a well-designed blog post, not a legal document.** The line length is comfortable. The spacing is generous. You actually want to read it.

3. **Dark mode that looks intentional.** True black background (#000) like Apple, not a gray (#0f172a) that looks like a dark theme was bolted on.

4. **It prints perfectly.** The same clean layout works on paper with zero modifications.

5. **The file is self-contained and tiny.** No external CSS, no JavaScript, no images. Just one HTML file under 50KB that looks like a million dollars.

6. **Zero branding from the tool.** No "Generated by Codepliant" watermark. The output belongs entirely to the user.

---

## 8. Recommended Implementation Changes

### Priority 1 — Layout Revolution
Replace the sidebar layout with a single-column, centered layout. This is the single biggest improvement.

```
BEFORE:                         AFTER:
┌──────┬─────────────┐         ┌───────────────────────┐
│ NAV  │             │         │                       │
│      │  Content    │         │    Company Name        │
│ Link │             │         │    Privacy Policy      │
│ Link │             │         │    ...content...       │
│ Link │             │         │                       │
│      │             │         │    Terms of Service    │
└──────┴─────────────┘         │    ...content...       │
                               │                       │
                               └───────────────────────┘
```

### Priority 2 — Typography Upgrade
Apply the font stack, sizes, and spacing from Section 4 above.

### Priority 3 — Color Simplification
Reduce to 6 custom properties. Apply Apple-inspired warm neutrals.

### Priority 4 — Remove JavaScript
The page should be pure HTML + CSS. No menu toggles. No event listeners. Zero JS.

### Priority 5 — Optional Top Navigation
If multiple documents exist, render a simple horizontal list of anchor links at the top. No styling beyond basic text links. Let them be what they are.

---

## 9. Reference CSS — Complete Minimal Stylesheet

This is the target stylesheet for the redesigned HTML output:

```css
:root {
  --text: #1d1d1f;
  --text-secondary: #6e6e73;
  --bg: #fff;
  --bg-alt: #f5f5f7;
  --accent: #0066cc;
  --border: #d2d2d7;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text: #f5f5f7;
    --text-secondary: #a1a1a6;
    --bg: #000;
    --bg-alt: #1d1d1f;
    --accent: #2997ff;
    --border: #424245;
  }
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Helvetica, Arial, sans-serif;
  font-size: 17px;
  line-height: 1.47059;
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
}

.page {
  max-width: 680px;
  margin: 0 auto;
  padding: 80px 24px 120px;
}

.page-header {
  margin-bottom: 64px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 4px;
}

.page-header .meta {
  font-size: 14px;
  color: var(--text-secondary);
}

.doc-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin-bottom: 64px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.doc-nav a {
  font-size: 14px;
  color: var(--accent);
  text-decoration: none;
}

.doc-nav a:hover { text-decoration: underline; }

section { margin-bottom: 80px; }

h1 { font-size: 40px; line-height: 1.1; font-weight: 700; letter-spacing: -0.015em; margin-bottom: 16px; }
h2 { font-size: 28px; line-height: 1.14; font-weight: 700; letter-spacing: -0.01em; margin-top: 56px; margin-bottom: 12px; }
h3 { font-size: 21px; line-height: 1.19; font-weight: 600; margin-top: 40px; margin-bottom: 8px; }
h4 { font-size: 17px; line-height: 1.47; font-weight: 600; margin-top: 32px; margin-bottom: 8px; }

p { margin-bottom: 16px; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
strong { font-weight: 600; }

ul, ol { margin: 8px 0 16px 24px; }
li { margin-bottom: 6px; }

blockquote {
  border-left: 3px solid var(--border);
  padding-left: 20px;
  color: var(--text-secondary);
  margin: 16px 0;
}

pre {
  background: var(--bg-alt);
  border-radius: 8px;
  padding: 16px 20px;
  overflow-x: auto;
  margin: 16px 0;
  font-size: 14px;
  line-height: 1.5;
}

code {
  font-family: "SF Mono", ui-monospace, Menlo, Consolas, monospace;
  font-size: 0.88em;
}

:not(pre) > code {
  background: var(--bg-alt);
  padding: 2px 6px;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
  margin: 16px 0;
}

th {
  text-align: left;
  font-weight: 600;
  padding: 10px 12px;
  border-bottom: 2px solid var(--border);
}

td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
}

hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 48px 0;
}

ul.checklist { list-style: none; margin-left: 0; }
ul.checklist li { padding-left: 4px; }

@media (max-width: 600px) {
  .page { padding: 48px 20px 80px; }
  h1 { font-size: 32px; }
  h2 { font-size: 24px; margin-top: 40px; }
  h3 { font-size: 19px; margin-top: 32px; }
}

@media print {
  body { font-size: 11pt; line-height: 1.5; color: #000; background: #fff; }
  .page { max-width: 100%; padding: 0; }
  .doc-nav { display: none; }
  h1 { font-size: 18pt; }
  h2 { font-size: 14pt; }
  section { page-break-inside: avoid; }
  a { color: #000; }
}
```

---

## 10. Summary

| Dimension | Current State | Target State |
|---|---|---|
| Layout | Sidebar + main (2 columns) | Single centered column |
| Max-width | 900px | 680px |
| Font size | Browser default (16px implied) | 17px explicit |
| Line-height | 1.7 | 1.47 (Apple standard) |
| CSS variables | 14 | 6 |
| JavaScript | Menu toggle + nav click handlers | Zero |
| Near-black | #1a1a2e | #1d1d1f (Apple warm) |
| Dark mode bg | #0f172a (slate) | #000000 (true black) |
| Heading borders | Yes (h1 2px, h2 1px) | None |
| TOC per section | Yes, in colored box | None (optional top nav only) |
| Visual metaphor | Documentation site | Magazine article |

The single guiding principle: **If it does not help the reader understand their compliance obligations, remove it.**
