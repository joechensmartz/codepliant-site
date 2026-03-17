import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://codepliant.dev";
  const today = new Date("2026-03-17");
  const recent = new Date("2026-03-15");

  return [
    // Homepage
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 1.0,
    },

    // Docs & Pricing — 0.8
    {
      url: `${baseUrl}/docs`,
      lastModified: recent,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: recent,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // Compliance pages — 0.7
    {
      url: `${baseUrl}/gdpr-compliance`,
      lastModified: recent,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/soc2-compliance`,
      lastModified: recent,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/hipaa-compliance`,
      lastModified: recent,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ai-governance`,
      lastModified: recent,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/data-privacy`,
      lastModified: recent,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // Blog index & posts — 0.7
    {
      url: `${baseUrl}/blog`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/soc2-for-startups`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/eu-ai-act-deadline`,
      lastModified: recent,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/privacy-policy-for-saas`,
      lastModified: recent,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/gdpr-for-developers`,
      lastModified: recent,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/colorado-ai-act`,
      lastModified: recent,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/generate-privacy-policy-from-code`,
      lastModified: recent,
      changeFrequency: "weekly",
      priority: 0.7,
    },

    // Generators — 0.5
    {
      url: `${baseUrl}/privacy-policy-generator`,
      lastModified: recent,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/ai-disclosure-generator`,
      lastModified: recent,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service-generator`,
      lastModified: recent,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cookie-policy-generator`,
      lastModified: recent,
      changeFrequency: "monthly",
      priority: 0.5,
    },

    // Other static pages
    {
      url: `${baseUrl}/compare`,
      lastModified: recent,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: recent,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
