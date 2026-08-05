/**
 * Типы контента лендинга.
 * Разметка не хранит текстов: секция получает свой объект пропсом.
 */

import type { QuizConfig } from "@/components/quiz/types";

export type IconName =
  | "ruble"
  | "clock"
  | "shield"
  | "broom"
  | "ruler"
  | "document"
  | "install"
  | "check"
  | "room"
  | "kitchen"
  | "bath"
  | "flat"
  | "chevron"
  | "phone";

/* ------------------------------- компания -------------------------------- */

/** Данные о компании. Живут только в content/business.ts. */
export interface BusinessInfo {
  readonly name: string;
  readonly legalName: string;
  readonly logoMark: string;
  readonly sinceYear: number;
  readonly phone: {
    readonly display: string;
    readonly href: string;
    readonly e164: string;
  };
  readonly email: { readonly display: string; readonly href: string };
  readonly address: {
    readonly street: string;
    readonly city: string;
    readonly postalCode: string;
    readonly country: string;
    readonly full: string;
  };
  readonly geo: { readonly latitude: number; readonly longitude: number };
  readonly hours: {
    readonly opens: string;
    readonly closes: string;
    readonly schemaSpec: string;
    readonly human: string;
    readonly humanShort: string;
  };
  readonly serviceArea: string;
  readonly serviceAreaShort: string;
  readonly requisites: {
    readonly inn: string;
    readonly kpp: string;
    readonly ogrn: string;
  };
  readonly messengers: readonly { readonly label: string; readonly href: string }[];
}

/* --------------------------------- цены ---------------------------------- */

/** Ставка за м² под ключ. Живёт только в content/prices.ts. */
export interface TextureRate {
  readonly id: string;
  readonly label: string;
  readonly rate: number;
  /** Короткое отличие — показывается прямо в варианте квиза. */
  readonly short: string;
  readonly good: string;
  readonly caution: string;
  /** Название для таблицы цен: там уточняем материал. */
  readonly tableLabel: string;
  readonly highlighted?: boolean;
}

/** Множитель за сложность помещения. */
export interface RoomRate {
  readonly id: string;
  readonly label: string;
  readonly note: string;
  readonly factor: number;
  readonly icon: IconName;
}

/* --------------------------------- header -------------------------------- */

export interface HeaderContent {
  readonly logoMark: string;
  readonly company: string;
  readonly phone: { readonly label: string; readonly href: string };
  readonly schedule: string;
  readonly nav: readonly { readonly label: string; readonly href: string }[];
  readonly cta: { readonly label: string; readonly href: string };
}

/* ---------------------------------- hero --------------------------------- */

export interface TrustBullet {
  readonly icon: IconName;
  readonly title: string;
  readonly note: string;
}

export interface HeroContent {
  readonly badge: string;
  readonly title: string;
  readonly subtitle: string;
  readonly primaryCta: { readonly label: string; readonly href: string };
  readonly secondaryCta: { readonly label: string; readonly href: string };
  readonly bullets: readonly TrustBullet[];
  /** Карточка первого экрана вместо фото: цена + что входит. */
  readonly priceCard: {
    readonly label: string;
    readonly value: string;
    readonly unit: string;
    readonly caption: string;
    readonly includedTitle: string;
    readonly included: readonly string[];
    readonly footnote: string;
  };
}

/* ---------------------------------- quiz --------------------------------- */

/** Подписи вокруг расчёта. Сам расчёт — lib/estimate.ts. */
export interface QuizEstimateText {
  readonly title: string;
  /** Шаблон с плейсхолдером {area}. Функций тут быть не может: */
  /* конфиг уезжает из серверного компонента в клиентский. */
  readonly forArea: string;
  readonly included: string;
  readonly disclaimer: string;
}

export interface QuizSectionContent {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  /** Конфигурация движка: шаги, навигация, тексты успеха и ошибки. */
  readonly config: QuizConfig;
  readonly estimate: QuizEstimateText;
}

/* --------------------------------- why us -------------------------------- */

export interface WhyUsCard {
  readonly icon: IconName;
  readonly title: string;
  readonly text: string;
  /** Возражение, которое закрывает карточка. Для самопроверки, не рендерится. */
  readonly objection: string;
}

export interface WhyUsContent {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly cards: readonly WhyUsCard[];
}

/* ------------------------------ how it works ----------------------------- */

export interface HowItWorksStep {
  readonly number: string;
  readonly timing: string;
  readonly title: string;
  readonly text: string;
}

export interface HowItWorksContent {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly steps: readonly HowItWorksStep[];
  readonly footnote: string;
  /** Возражение, которое снимает секция. Для самопроверки, не рендерится. */
  readonly objection: string;
  readonly cta: { readonly label: string; readonly href: string };
}

/* -------------------------------- pricing -------------------------------- */

export interface PricingRow {
  readonly texture: string;
  readonly price: string;
  readonly unit: string;
  readonly good: string;
  readonly caution: string;
  readonly highlighted?: boolean;
}

export interface PricingExtra {
  readonly label: string;
  readonly price: string;
}

export interface PricingContent {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly columns: {
    readonly texture: string;
    readonly price: string;
    readonly good: string;
    readonly caution: string;
  };
  readonly rows: readonly PricingRow[];
  readonly extrasTitle: string;
  readonly extras: readonly PricingExtra[];
  readonly included: readonly string[];
  readonly includedTitle: string;
  readonly note: string;
  readonly cta: { readonly label: string; readonly href: string };
  /** Подпись на выделенном тарифе. */
  readonly popularLabel: string;
  /** Возражение, которое снимает секция. Для самопроверки, не рендерится. */
  readonly objection: string;
}

/* --------------------------------- works --------------------------------- */

export interface WorkItem {
  readonly src: string;
  readonly alt: string;
  readonly title: string;
  readonly meta: string;
}

export interface WorksContent {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly items: readonly WorkItem[];
}

/* -------------------------------- reviews -------------------------------- */

export interface Review {
  readonly name: string;
  /** Первая буква фамилии с точкой: «М.». */
  readonly surnameInitial: string;
  readonly district: string;
  readonly date: string;
  readonly text: string;
  readonly job: string;
  /** Возражение, которое снимает отзыв. Для самопроверки, не рендерится. */
  readonly objection: string;
}

export interface ReviewsContent {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly items: readonly Review[];
}

/* ----------------------------------- faq --------------------------------- */

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface FaqContent {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly items: readonly FaqItem[];
}

/* ------------------------------- final cta ------------------------------- */

export interface FinalCtaContent {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly nameLabel: string;
  readonly namePlaceholder: string;
  readonly nameError: string;
  readonly phoneLabel: string;
  readonly phonePlaceholder: string;
  readonly phoneError: string;
  readonly submitLabel: string;
  readonly submittingLabel: string;
  readonly retryLabel: string;
  readonly consent: string;
  readonly successTitle: string;
  readonly successSteps: readonly string[];
  readonly errorText: string;
  readonly bullets: readonly string[];
}

/* --------------------------------- footer -------------------------------- */

export interface LinkItem {
  readonly label: string;
  readonly href: string;
}

export interface FooterContent {
  readonly logoMark: string;
  readonly company: string;
  readonly tagline: string;
  readonly columns: {
    readonly contacts: string;
    readonly sections: string;
    readonly working: string;
  };
  /** Реквизиты одной строкой: ООО, ИНН, КПП, ОГРН. */
  readonly requisites: string;
  readonly address: string;
  readonly serviceArea: string;
  readonly phone: LinkItem;
  readonly email: LinkItem;
  readonly schedule: string;
  readonly messengers: readonly LinkItem[];
  readonly nav: readonly LinkItem[];
  readonly legalLinks: readonly LinkItem[];
  readonly disclaimer: string;
  /** Год основания. Правый край копирайта считается от текущего года. */
  readonly sinceYear: number;
}

/* ---------------------------------- legal -------------------------------- */

export interface LegalSection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
}

export interface LegalPageContent {
  readonly slug: string;
  readonly title: string;
  readonly updated: string;
  readonly intro: string;
  readonly sections: readonly LegalSection[];
}

export interface LegalContent {
  /** Строка согласия под формами со ссылками на документы. */
  readonly consentLead: string;
  readonly privacyLink: LinkItem;
  readonly consentLink: LinkItem;
  readonly backLabel: string;
  readonly privacyPage: LegalPageContent;
  readonly consentPage: LegalPageContent;
}

/* -------------------------------- 404 ------------------------------------ */

export interface NotFoundContent {
  readonly code: string;
  readonly title: string;
  readonly text: string;
  readonly homeLabel: string;
}

/* ---------------------------------- meta --------------------------------- */

export interface MetaContent {
  readonly siteUrl: string;
  readonly title: string;
  readonly description: string;
  readonly ogTitle: string;
  readonly ogDescription: string;
  readonly keywords: readonly string[];
  readonly organization: {
    readonly name: string;
    readonly phone: string;
    readonly areaServed: string;
  };
  readonly priceRange: string;
}

/* -------------------------------- landing -------------------------------- */

export interface LandingContent {
  readonly meta: MetaContent;
  readonly header: HeaderContent;
  readonly hero: HeroContent;
  readonly quiz: QuizSectionContent;
  readonly whyUs: WhyUsContent;
  readonly howItWorks: HowItWorksContent;
  readonly pricing: PricingContent;
  readonly works: WorksContent;
  readonly reviews: ReviewsContent;
  readonly faq: FaqContent;
  readonly finalCta: FinalCtaContent;
  readonly footer: FooterContent;
  readonly legal: LegalContent;
  readonly business404: NotFoundContent;
}
