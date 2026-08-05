import type { HeaderContent } from "./types";
import { business } from "./business";

/**
 * У шапки свои короткие подписи: длинные названия секций из футера
 * ломают её в один ряд на ноутбуках.
 */
export const header = {
  logoMark: business.logoMark,
  company: business.name,
  phone: { label: business.phone.display, href: business.phone.href },
  schedule: business.hours.humanShort,
  // Работы вернутся вместе с секцией галереи (ждёт фото).
  nav: [
    { label: "Этапы", href: "#how-it-works" },
    { label: "Цены", href: "#pricing" },
    { label: "Отзывы", href: "#reviews" },
    { label: "Вопросы", href: "#faq" },
  ],
  cta: { label: "Записаться на замер", href: "#quiz" },
} satisfies HeaderContent;
