import { ImageResponse } from "next/og";
import { BRAND, OG_SIZE, OgWrapper, ShieldIcon } from "../og/og-utils";

export const runtime = "edge";
export const alt = "GDPR Compliance Tool for Developers | Codepliant";
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
          {/* Top: Codepliant branding */}
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

          {/* Page title */}
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
              GDPR Compliance
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
              for Developers
            </span>
          </div>

          {/* Description */}
          <span
            style={{
              fontSize: 22,
              color: BRAND.inkSecondary,
              lineHeight: 1.5,
              marginTop: 24,
              maxWidth: 700,
            }}
          >
            Generate privacy policies, DPAs, and data flow maps
            from your actual codebase. Automated GDPR documentation.
          </span>

          {/* Tags */}
          <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
            {["Privacy Policy", "DPA", "DSAR Guide", "Data Flow Map"].map(
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
