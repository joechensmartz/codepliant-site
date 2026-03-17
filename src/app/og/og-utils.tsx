/** Shared constants and components for OG image generation */

export const BRAND = {
  bg: "#faf8f5",
  ink: "#1a1714",
  inkSecondary: "#5c5549",
  inkTertiary: "#8a8278",
  brand: "#1a7a6d",
  brandMuted: "#d4eae6",
  surfaceSecondary: "#f2efe9",
  surfaceTertiary: "#e8e4dc",
  borderSubtle: "#ddd8ce",
  codeBg: "#28241e",
  codeFg: "#e8e4dc",
} as const;

export const OG_SIZE = { width: 1200, height: 630 } as const;

/** Shield icon as JSX for OG images (Satori-compatible) */
export function ShieldIcon({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
        fill={BRAND.brandMuted}
        stroke={BRAND.brand}
        strokeWidth="1.5"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke={BRAND.brand}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Terminal mockup showing `npx codepliant go` */
export function TerminalMockup() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: BRAND.codeBg,
        borderRadius: 12,
        padding: "16px 24px",
        width: 480,
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
      }}
    >
      {/* Traffic lights */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: "#ff5f57",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: "#febc2e",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: "#28c840",
          }}
        />
      </div>
      {/* Command */}
      <div
        style={{
          display: "flex",
          fontFamily: "monospace",
          fontSize: 18,
          color: BRAND.codeFg,
          lineHeight: 1.6,
        }}
      >
        <span style={{ color: "#8a8278", marginRight: 10 }}>$</span>
        <span>npx codepliant go</span>
      </div>
      {/* Output lines */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontFamily: "monospace",
          fontSize: 14,
          color: "#8a8278",
          lineHeight: 1.7,
          marginTop: 6,
        }}
      >
        <span>
          <span style={{ color: "#28c840" }}>✓</span> Scanned 847 files
        </span>
        <span>
          <span style={{ color: "#28c840" }}>✓</span> Detected 12 services
        </span>
        <span>
          <span style={{ color: "#28c840" }}>✓</span> Generated 6 documents
        </span>
      </div>
    </div>
  );
}

/** Common OG image wrapper with branding */
export function OgWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: BRAND.bg,
        position: "relative",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(${BRAND.borderSubtle}33 1px, transparent 1px), linear-gradient(90deg, ${BRAND.borderSubtle}33 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Bottom brand accent bar */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: BRAND.brand,
        }}
      />
      {/* Content */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "60px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
