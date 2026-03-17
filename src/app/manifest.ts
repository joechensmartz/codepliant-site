import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Codepliant",
    short_name: "Codepliant",
    description:
      "Scan your codebase and generate privacy policies, terms of service, AI disclosures, and 123+ compliance documents automatically.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#1a7a6d",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
