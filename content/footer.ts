import type { FooterContent } from "./types";
import { business, requisitesLine } from "./business";

/** Отображение футера. Все факты — из content/business.ts. */
export const footer = {
  logoMark: business.logoMark,
  company: business.name,
  tagline: `Натяжные потолки в Москве и области с ${business.sinceYear} года`,
  columns: {
    contacts: "Контакты",
    sections: "Разделы",
    working: "Работаем",
  },

  requisites: requisitesLine,
  address: business.address.full,
  serviceArea: business.serviceArea,
  phone: { label: business.phone.display, href: business.phone.href },
  email: { label: business.email.display, href: business.email.href },
  schedule: business.hours.human,

  messengers: business.messengers,

  nav: [
    { label: "Цены", href: "#pricing" },
    { label: "Как проходит работа", href: "#how-it-works" },
    { label: "Отзывы", href: "#reviews" },
    { label: "Вопросы", href: "#faq" },
  ],

  legalLinks: [
    { label: "Политика конфиденциальности", href: "/privacy" },
    { label: "Согласие на обработку данных", href: "/consent" },
  ],

  disclaimer:
    "Демо-проект для портфолио. Компания вымышленная, контакты нерабочие.",

  sinceYear: business.sinceYear,
} satisfies FooterContent;
