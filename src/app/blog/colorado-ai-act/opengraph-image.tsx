import { ImageResponse } from "next/og";
import { OG_SIZE } from "../../og/og-utils";
import { BlogOgLayout } from "../../og/blog-og";

export const runtime = "edge";
export const alt = "Colorado AI Act: What Developers Need to Know";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <BlogOgLayout
        title="Colorado AI Act: What Developers Need to Know"
        category="AI Governance"
        date="Mar 16, 2026"
      />
    ),
    { ...size }
  );
}
