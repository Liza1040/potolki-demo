import type { RoomRate, TextureRate } from "./types";

/**
 * ЕДИНСТВЕННЫЙ ИСТОЧНИК ЦЕН.
 *
 * Отсюда цифры расходятся в квиз (расчёт вилки), таблицу цен и первый экран.
 * Правится только здесь — иначе расчёт квиза разъедется с прайсом.
 *
 * rate   — ₽ за м² под ключ: полотно, профиль, монтаж, уборка.
 * factor — множитель за сложность помещения.
 */

export const TEXTURES = [
  {
    id: "matte",
    label: "Матовый",
    rate: 390,
    short: "Без бликов, выглядит как ровный крашеный потолок",
    good: "Спальня, детская, любая комната с обычным светом. Выглядит как ровный крашеный потолок.",
    caution: "Если хотите визуально поднять низкий потолок — он этого не сделает.",
    tableLabel: "Матовый ПВХ",
    /** Выделяем в таблице: берут чаще всего. */
    highlighted: true,
  },
  {
    id: "satin",
    label: "Сатиновый",
    rate: 450,
    short: "Лёгкий перламутр, мягко отражает свет, легче моется",
    good: "Гостиная и кухня. Мягко отражает свет, легче моется, чем матовый.",
    caution: "Разницу с матовым видно только при боковом свете. Переплата не всегда оправдана.",
    tableLabel: "Сатиновый ПВХ",
    highlighted: false,
  },
  {
    id: "gloss",
    label: "Глянцевый",
    rate: 480,
    short: "Зеркалит и визуально поднимает потолок, заметнее пыль",
    good: "Маленькие комнаты и коридоры: отражение добавляет высоты и света.",
    caution: "В спальне зеркальный потолок нравится не всем. На нём заметнее пыль.",
    tableLabel: "Глянцевый ПВХ",
    highlighted: false,
  },
  {
    id: "fabric",
    label: "Тканевый",
    rate: 1150,
    short: "Без шва до 5 м, дышит, втрое дороже ПВХ",
    good: "Комнаты шире 3,5 м, где не хочется шва. Держит холод, не боится минусовых температур.",
    caution: "Для стандартной комнаты в квартире это переплата почти втрое.",
    tableLabel: "Тканевый",
    highlighted: false,
  },
] as const satisfies readonly TextureRate[];

export const ROOMS = [
  {
    id: "living",
    label: "Комната",
    note: "Гостиная, спальня, детская",
    factor: 1,
    icon: "room",
  },
  {
    id: "kitchen",
    label: "Кухня",
    note: "Нужна фактура, которая моется",
    factor: 1.05,
    icon: "kitchen",
  },
  {
    id: "bathroom",
    label: "Санузел",
    note: "Влажность, много углов и коробов",
    factor: 1.15,
    icon: "bath",
  },
  {
    id: "whole",
    label: "Вся квартира",
    note: "Считаем по общей площади, дешевле за м²",
    factor: 0.92,
    icon: "flat",
  },
] as const satisfies readonly RoomRate[];

/** Самая дешёвая фактура — база для «от N ₽» на первом экране. */
export const BASE_TEXTURE = TEXTURES[0];

/** Светильник считается отдельно и упоминается в прайсе и в FAQ. */
export const LIGHT_FIXTURE_PRICE = 590;

export type TextureId = (typeof TEXTURES)[number]["id"];
export type RoomId = (typeof ROOMS)[number]["id"];

export function findTexture(id: string): TextureRate | undefined {
  return TEXTURES.find((texture) => texture.id === id);
}

export function findRoom(id: string): RoomRate | undefined {
  return ROOMS.find((room) => room.id === id);
}
