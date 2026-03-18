import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/", "/api/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/_next/", "/api/"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/_next/", "/api/"],
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: ["/_next/", "/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/_next/", "/api/"],
      },
      {
        userAgent: "Amazonbot",
        allow: "/",
        disallow: ["/_next/", "/api/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/_next/", "/api/"],
      },
    ],
    sitemap: "https://www.codepliant.site/sitemap.xml",
  };
}
