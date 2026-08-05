import type { BusinessInfo } from "./types";

/**
 * ЕДИНСТВЕННЫЙ ИСТОЧНИК ДАННЫХ О КОМПАНИИ.
 *
 * Отсюда берут: шапка, футер, метатеги, LocalBusiness JSON-LD, тексты
 * ошибок в формах. Телефон правится только здесь — иначе он разъедется
 * по шести файлам, как было до этого рефакторинга.
 *
 * Часы работы и адрес заданы дважды намеренно: человеку нужен текст
 * («ежедневно с 9:00 до 21:00»), поисковику — машинный формат
 * («Mo-Su 09:00-21:00»). Обе формы живут рядом, чтобы не разошлись.
 *
 * Реквизиты вымышленные, но с верными контрольными разрядами:
 * ИНН 7724561300 и ОГРН 1167746598326 проходят проверку по алгоритму.
 */
export const business = {
  name: "Потолки Первый Метр",
  legalName: "ООО «Первый Метр»",
  logoMark: "1м",
  sinceYear: 2016,

  phone: {
    display: "+7 (495) 128-46-19",
    href: "tel:+74951284619",
    e164: "+74951284619",
  },

  email: {
    display: "zakaz@pervyi-metr.ru",
    href: "mailto:zakaz@pervyi-metr.ru",
  },

  address: {
    street: "ул. Дубининская, 57к2, офис 314",
    city: "Москва",
    postalCode: "115054",
    country: "RU",
    full: "Москва, ул. Дубининская, 57к2, офис 314",
  },

  /** Координаты офиса для LocalBusiness. Демо-значения, район Даниловский. */
  geo: { latitude: 55.7185, longitude: 37.6275 },

  hours: {
    opens: "09:00",
    closes: "21:00",
    /** Формат schema.org: перечисление дней + интервал. */
    schemaSpec: "Mo-Su 09:00-21:00",
    human: "Замеры и монтаж ежедневно с 9:00 до 21:00",
    humanShort: "Ежедневно 9:00–21:00",
  },

  serviceArea: "Москва и область в пределах 30 км от МКАД",
  serviceAreaShort: "Москва и Московская область",

  requisites: {
    inn: "7724561300",
    kpp: "772401001",
    ogrn: "1167746598326",
  },

  messengers: [
    { label: "WhatsApp", href: "https://wa.me/74951284619" },
    { label: "Telegram", href: "https://t.me/pervyimetr" },
  ],
} as const satisfies BusinessInfo;

/** «ООО «Первый Метр» · ИНН … · КПП … · ОГРН …» для футера. */
export const requisitesLine = [
  business.legalName,
  `ИНН ${business.requisites.inn}`,
  `КПП ${business.requisites.kpp}`,
  `ОГРН ${business.requisites.ogrn}`,
].join(" · ");
