import { ImageResponse } from "next/og";
import { OG_SIZE } from "../../og/og-utils";
import { BlogOgLayout } from "../../og/blog-og";

export const runtime = "edge";
export const alt = "Privacy Policy for SaaS: Complete Guide";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <BlogOgLayout
        title="Privacy Policy for SaaS: Complete Guide for 2026"
        category="Privacy"
        date="Mar 16, 2026"
      />
    ),
    { ...size }
  );
}
