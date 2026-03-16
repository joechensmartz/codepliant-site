import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { scanTracking } from "./tracking.js";

function createTempProject(
  files: Record<string, string>
): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codepliant-tracking-"));
  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(dir, filename);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
  }
  return dir;
}

function cleanup(dir: string) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("scanTracking", () => {
  it("detects Google Analytics gtag in HTML", () => {
    const dir = createTempProject({
      "index.html": `
        <html>
          <head>
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"></script>
            <script>
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXX');
            </script>
          </head>
          <body></body>
        </html>
      `,
    });
    try {
      const result = scanTracking(dir);
      const ga = result.find((s) => s.name === "Google Analytics");
      assert.ok(ga, "Should detect Google Analytics");
      assert.strictEqual(ga.category, "analytics");
      assert.ok(ga.evidence.length >= 1);
      assert.ok(ga.dataCollected.includes("page views"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Meta/Facebook Pixel in JSX", () => {
    const dir = createTempProject({
      "components/Layout.jsx": `
        import React from 'react';
        export default function Layout({ children }) {
          return (
            <html>
              <head>
                <script dangerouslySetInnerHTML={{ __html: \`
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  t=b.createElement(e);t.async=!0;
                  t.src='https://connect.facebook.net/en_US/fbevents.js';
                  fbq('init', '1234567890');
                  fbq('track', 'PageView');
                \`}} />
              </head>
              <body>{children}</body>
            </html>
          );
        }
      `,
    });
    try {
      const result = scanTracking(dir);
      const fb = result.find((s) => s.name === "Meta Pixel");
      assert.ok(fb, "Should detect Meta Pixel");
      assert.strictEqual(fb.category, "advertising");
      assert.ok(fb.dataCollected.includes("conversion events"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Hotjar in TSX", () => {
    const dir = createTempProject({
      "app/layout.tsx": `
        export default function RootLayout({ children }: { children: React.ReactNode }) {
          return (
            <html>
              <head>
                <script dangerouslySetInnerHTML={{ __html: \`
                  (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:123456,hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                \`}} />
              </head>
              <body>{children}</body>
            </html>
          );
        }
      `,
    });
    try {
      const result = scanTracking(dir);
      const hotjar = result.find((s) => s.name === "Hotjar");
      assert.ok(hotjar, "Should detect Hotjar");
      assert.strictEqual(hotjar.category, "analytics");
      assert.ok(hotjar.dataCollected.includes("session recordings"));
    } finally {
      cleanup(dir);
    }
  });

  it("detects Microsoft Clarity and Plausible in Vue file", () => {
    const dir = createTempProject({
      "App.vue": `
        <template>
          <div id="app"><router-view /></div>
        </template>
        <script>
        export default {
          head() {
            return {
              script: [
                { src: 'https://www.clarity.ms/tag/abcdef' },
                { src: 'https://plausible.io/js/script.js', 'data-domain': 'example.com' }
              ]
            }
          }
        }
        </script>
      `,
    });
    try {
      const result = scanTracking(dir);
      const clarity = result.find((s) => s.name === "Microsoft Clarity");
      assert.ok(clarity, "Should detect Microsoft Clarity");
      assert.strictEqual(clarity.category, "analytics");

      const plausible = result.find((s) => s.name === "Plausible Analytics");
      assert.ok(plausible, "Should detect Plausible Analytics");
      assert.strictEqual(plausible.category, "analytics");
    } finally {
      cleanup(dir);
    }
  });

  it("detects multiple advertising pixels in Svelte file", () => {
    const dir = createTempProject({
      "src/routes/+layout.svelte": `
        <svelte:head>
          <script src="https://analytics.tiktok.com/i18n/pixel/events.js"></script>
          <script src="https://snap.licdn.com/li.lms-analytics/insight.min.js"></script>
          <script src="https://static.ads-twitter.com/uwt.js"></script>
        </svelte:head>
        <slot />
      `,
    });
    try {
      const result = scanTracking(dir);
      const tiktok = result.find((s) => s.name === "TikTok Pixel");
      assert.ok(tiktok, "Should detect TikTok Pixel");
      assert.strictEqual(tiktok.category, "advertising");

      const linkedin = result.find((s) => s.name === "LinkedIn Insight Tag");
      assert.ok(linkedin, "Should detect LinkedIn Insight Tag");
      assert.strictEqual(linkedin.category, "advertising");

      const twitter = result.find((s) => s.name === "Twitter/X Pixel");
      assert.ok(twitter, "Should detect Twitter/X Pixel");
      assert.strictEqual(twitter.category, "advertising");
    } finally {
      cleanup(dir);
    }
  });

  it("detects Fathom Analytics", () => {
    const dir = createTempProject({
      "index.html": `
        <html>
          <head>
            <script src="https://cdn.usefathom.com/script.js" data-site="ABCDEF" defer></script>
          </head>
          <body></body>
        </html>
      `,
    });
    try {
      const result = scanTracking(dir);
      const fathom = result.find((s) => s.name === "Fathom Analytics");
      assert.ok(fathom, "Should detect Fathom Analytics");
      assert.strictEqual(fathom.category, "analytics");
    } finally {
      cleanup(dir);
    }
  });

  it("returns empty array when no tracking scripts found", () => {
    const dir = createTempProject({
      "index.html": `
        <html>
          <head><title>Clean page</title></head>
          <body><h1>Hello</h1></body>
        </html>
      `,
    });
    try {
      const result = scanTracking(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });

  it("does not scan files in node_modules", () => {
    const dir = createTempProject({
      "node_modules/some-lib/index.html": `<script>gtag('config', 'G-XXXXX');</script>`,
      "index.html": `<html><body>Clean</body></html>`,
    });
    try {
      const result = scanTracking(dir);
      assert.strictEqual(result.length, 0);
    } finally {
      cleanup(dir);
    }
  });
});
