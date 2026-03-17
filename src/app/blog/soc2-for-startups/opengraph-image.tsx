import { ImageResponse } from "next/og";
import { OG_SIZE } from "../../og/og-utils";
import { BlogOgLayout } from "../../og/blog-og";

export const runtime = "edge";
export const alt = "SOC 2 for Startups: A Practical Guide";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <BlogOgLayout
        title="SOC 2 for Startups: A Practical Guide"
        category="SOC 2"
        date="Mar 16, 2026"
      />
    ),
    { ...size }
  );
}
