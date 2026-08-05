import type { MetadataRoute } from "next";

import { content } from "@/content";

/**
 * sitemap.xml через соглашение Next (app/sitemap.ts), а не статический файл.
 *
 * В карту попадает только главная: /privacy и /consent помечены noindex,
 * тащить их в sitemap — противоречить самим себе.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: content.meta.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
