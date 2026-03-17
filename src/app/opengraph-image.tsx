import { ImageResponse } from "next/og";
import {
  BRAND,
  OG_SIZE,
  OgWrapper,
  ShieldIcon,
  TerminalMockup,
} from "./og/og-utils";

export const runtime = "edge";
export const alt = "Codepliant — Compliance Documents from Your Code";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <OgWrapper>
        {/* Left column: branding + tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingRight: 40,
          }}
        >
          {/* Logo mark + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ShieldIcon size={56} />
            <span
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: BRAND.ink,
                letterSpacing: "-0.02em",
              }}
            >
              Codepliant
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 28,
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 26,
                color: BRAND.inkSecondary,
                lineHeight: 1.4,
              }}
            >
              Compliance documents from your code.
            </span>
            <span
              style={{
                fontSize: 18,
                color: BRAND.inkTertiary,
                lineHeight: 1.5,
                marginTop: 8,
              }}
            >
              Privacy policies, terms of service, AI disclosures
              — generated from what your app actually does.
            </span>
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            {["122+ doc types", "Open source", "Zero network calls"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: BRAND.surfaceSecondary,
                    border: `1px solid ${BRAND.borderSubtle}`,
                    borderRadius: 20,
                    padding: "6px 14px",
                    fontSize: 14,
                    color: BRAND.inkSecondary,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
                      fill={BRAND.brand}
                    />
                  </svg>
                  {label}
                </div>
              )
            )}
          </div>
        </div>

        {/* Right column: terminal mockup */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TerminalMockup />
        </div>
      </OgWrapper>
    ),
    { ...size }
  );
}
