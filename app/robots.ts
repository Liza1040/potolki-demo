import type { MetadataRoute } from "next";

import { content } from "@/content";

/**
 * robots.txt через соглашение Next (app/robots.ts).
 *
 * /privacy и /consent намеренно НЕ закрыты здесь: если запретить обход,
 * робот не прочитает их noindex и может показать страницу в выдаче
 * без описания. Закрываем их метатегом, а не robots.txt.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${content.meta.siteUrl}/sitemap.xml`,
    host: content.meta.siteUrl,
  };
}
