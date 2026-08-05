import type { MetadataRoute } from "next";

import { content } from "@/content";

/**
 * Веб-манифест через соглашение Next: файл app/manifest.ts отдаётся
 * по /manifest.webmanifest, ссылка в <head> подставляется автоматически.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: content.meta.organization.name,
    short_name: content.footer.company,
    description: content.meta.ogDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1d4ed8",
    lang: "ru",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
