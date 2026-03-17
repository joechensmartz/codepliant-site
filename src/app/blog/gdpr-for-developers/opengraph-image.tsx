import { ImageResponse } from "next/og";
import { OG_SIZE } from "../../og/og-utils";
import { BlogOgLayout } from "../../og/blog-og";

export const runtime = "edge";
export const alt = "GDPR Compliance for Developers: A Practical Guide";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <BlogOgLayout
        title="GDPR Compliance for Developers: A Practical Guide"
        category="GDPR"
        date="Mar 16, 2026"
      />
    ),
    { ...size }
  );
}
