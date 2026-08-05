import type { HeroContent } from "./types";
import { BASE_TEXTURE, TEXTURES } from "./prices";

/** «Комната 18 м² — около N ₽»: та же ставка, что в квизе и прайсе. */
const SAMPLE_AREA = 18;
const SAMPLE_PRICE = (BASE_TEXTURE.rate * SAMPLE_AREA).toLocaleString("ru-RU");

/**
 * Закрывает возражение №1: непонятна цена и страх доплат при монтаже.
 * Заголовок — 8 слов, оффер + срок + гарантия цены.
 */
export const hero = {
  badge: "Москва и область, выезд в день обращения",

  title: "Натяжной потолок за 1 день, цена в договоре",

  subtitle:
    "Замерщик приезжает бесплатно, считает при вас и вписывает итог в договор. " +
    "Сумма при монтаже не меняется — ни за углы, ни за трубы, ни за светильники.",

  primaryCta: {
    label: "Рассчитать стоимость за минуту",
    href: "#quiz",
  },

  secondaryCta: {
    label: "Посмотреть цены за м²",
    href: "#pricing",
  },

  bullets: [
    {
      icon: "ruble",
      title: "Цена фиксируется в договоре",
      note: "Считаем на замере при вас. Доплат при монтаже нет",
    },
    {
      icon: "clock",
      title: "Комната до 20 м² — за день",
      note: "Приезжаем утром, к вечеру убрано и можно жить",
    },
    {
      icon: "shield",
      title: "Гарантия 10 лет",
      note: "На полотно и шов, по договору. Работаем с 2016 года",
    },
  ],

  priceCard: {
    label: `${BASE_TEXTURE.label} потолок под ключ`,
    value: String(BASE_TEXTURE.rate),
    unit: "₽ за м²",
    caption: `Комната ${SAMPLE_AREA} м² — около ${SAMPLE_PRICE} ₽ без светильников`,
    includedTitle: "В эту цену уже входит",
    included: [
      "Выезд замерщика и расчёт",
      "Полотно и гарпунный профиль",
      "Монтаж и уборка после работы",
      "Гарантия 10 лет по договору",
    ],
    footnote: TEXTURES.slice(1)
      .map((texture) => `${texture.label.toLowerCase()} — от ${texture.rate} ₽`)
      .join(", "),
  },
} satisfies HeroContent;
