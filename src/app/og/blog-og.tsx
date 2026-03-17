import { BRAND, OgWrapper, ShieldIcon } from "./og-utils";

/** Shared blog post OG layout — used by per-post opengraph-image.tsx files */
export function BlogOgLayout({
  title,
  category,
  date,
}: {
  title: string;
  category: string;
  date: string;
}) {
  return (
    <OgWrapper>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Top: category + date */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              backgroundColor: BRAND.brandMuted,
              color: BRAND.brand,
              borderRadius: 16,
              padding: "6px 16px",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {category}
          </div>
          <span style={{ fontSize: 16, color: BRAND.inkTertiary }}>{date}</span>
        </div>

        {/* Center: title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: BRAND.ink,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              maxWidth: 900,
            }}
          >
            {title}
          </span>
        </div>

        {/* Bottom: Codepliant branding */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ShieldIcon size={32} />
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: BRAND.ink,
            }}
          >
            Codepliant
          </span>
          <span
            style={{
              fontSize: 16,
              color: BRAND.inkTertiary,
              marginLeft: 4,
            }}
          >
            Blog
          </span>
        </div>
      </div>
    </OgWrapper>
  );
}
