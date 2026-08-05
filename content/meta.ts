import type { MetaContent } from "./types";
import { business } from "./business";
import { BASE_TEXTURE, TEXTURES } from "./prices";

/**
 * Метатеги. Цифры — из prices.ts, факты о компании — из business.ts.
 *
 * Длины выверены под выдачу:
 *  - title ≤ 60 символов, иначе Яндекс и Google обрежут «…»;
 *  - description 150–160, он почти целиком попадает в сниппет.
 * При правке текстов держите эти рамки — проверка есть в scripts/check-meta.
 */

const minRate = BASE_TEXTURE.rate;
const maxRate = Math.max(...TEXTURES.map((t) => t.rate));

export const meta = {
  // Прод-адрес задаётся через NEXT_PUBLIC_SITE_URL, локально — заглушка
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pervyi-metr.example",

  // 49 символов: оффер + гео + цена
  title: `Натяжные потолки в Москве за 1 день — от ${minRate} ₽/м²`,

  // 160 символов: цена, срок, гарантия, гео
  description:
    `Натяжные потолки под ключ от ${minRate} ₽/м². Замер бесплатно в день ` +
    "обращения, цена в договоре не растёт при монтаже. Комната за 1 день, " +
    "гарантия 10 лет. Москва и МО.",

  ogTitle: "Натяжной потолок за 1 день, цена в договоре",
  ogDescription:
    `От ${minRate} ₽/м² под ключ. Бесплатный замер, монтаж за день, ` +
    "гарантия 10 лет.",

  keywords: [
    "натяжные потолки москва",
    "натяжные потолки цена за м2",
    "натяжные потолки за день",
    "матовый натяжной потолок",
    "замер натяжного потолка бесплатно",
  ],

  organization: {
    name: business.name,
    phone: business.phone.display,
    areaServed: business.serviceAreaShort,
  },

  /** Диапазон цен для LocalBusiness. */
  priceRange: `${minRate}–${maxRate} ₽ за м²`,
} satisfies MetaContent;
