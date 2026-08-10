import { findRoom, findTexture } from "@/content/prices";
import type { Answers } from "@/components/quiz/types";

/**
 * Расчёт вилки по ответам квиза.
 * Ставки берутся из content/prices.ts — того же места, что и таблица цен.
 */

/** Разброс вокруг базовой суммы: показываем вилку, а не точную цифру. */
const SPREAD = 0.1;

export interface Estimate {
  readonly area: number;
  readonly min: number;
  readonly max: number;
  readonly roomLabel: string;
  readonly textureLabel: string;
  readonly rate: number;
}

function roundToHundred(value: number): number {
  return Math.round(value / 100) * 100;
}

export function calculateEstimate(answers: Answers): Estimate | null {
  const room = typeof answers.room === "string" ? findRoom(answers.room) : undefined;
  const texture =
    typeof answers.texture === "string" ? findTexture(answers.texture) : undefined;
  const area = typeof answers.area === "number" ? answers.area : 0;

  if (room === undefined || texture === undefined || area <= 0) {
    return null;
  }

  const base = texture.rate * room.factor * area;

  return {
    area,
    min: roundToHundred(base * (1 - SPREAD)),
    max: roundToHundred(base * (1 + SPREAD)),
    roomLabel: room.label,
    textureLabel: texture.label,
    rate: texture.rate,
  };
}

/**
 * Форматирование переехало в lib/format: неразрывный пробел должен жить
 * в одном месте. Здесь была локальная копия с обычным пробелом перед знаком
 * рубля — сумма рвалась переносом в узкой колонке. Реэкспорт, чтобы не
 * править импорты по секциям.
 */
export { formatRub, formatNumber, withUnit } from "./format";
