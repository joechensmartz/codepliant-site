import { ImageResponse } from "next/og";
import { OG_SIZE } from "../../og/og-utils";
import { BlogOgLayout } from "../../og/blog-og";

export const runtime = "edge";
export const alt = "HIPAA for SaaS Developers: What You Actually Need to Know";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <BlogOgLayout
        title="HIPAA for SaaS Developers: What You Actually Need to Know"
        category="HIPAA"
        date="Mar 17, 2026"
      />
    ),
    { ...size }
  );
}
