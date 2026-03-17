import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OgWrapper, ShieldIcon } from "../og/og-utils";

export const runtime = "edge";
export const alt = "AI Governance & EU AI Act Compliance | Codepliant";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <OgWrapper>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ShieldIcon size={40} />
            <span
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: BRAND.inkTertiary,
              }}
            >
              Codepliant
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 32,
            }}
          >
            <span
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: BRAND.ink,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              AI Governance
            </span>
            <span
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: BRAND.brand,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              & EU AI Act
            </span>
          </div>

          <span
            style={{
              fontSize: 22,
              color: BRAND.inkSecondary,
              lineHeight: 1.5,
              marginTop: 24,
              maxWidth: 700,
            }}
          >
            Generate AI disclosures, risk assessments, and model cards
            from your codebase. EU AI Act compliance automated.
          </span>

          <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
            {["AI Disclosure", "Risk Assessment", "Model Card", "AI Policy"].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    backgroundColor: BRAND.brandMuted,
                    color: BRAND.brand,
                    borderRadius: 16,
                    padding: "6px 14px",
                    fontSize: 15,
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </div>
              )
            )}
          </div>
        </div>
      </OgWrapper>
    ),
    { ...size }
  );
}
