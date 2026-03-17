import { ImageResponse } from "next/og";
import { OG_SIZE } from "../../og/og-utils";
import { BlogOgLayout } from "../../og/blog-og";

export const runtime = "edge";
export const alt = "How to Generate a Privacy Policy from Your Codebase";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <BlogOgLayout
        title="How to Generate a Privacy Policy from Your Codebase"
        category="Privacy"
        date="Mar 16, 2026"
      />
    ),
    { ...size }
  );
}
