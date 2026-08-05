import { isValidPhone } from "@/lib/phone";
import type { ValidationRule } from "./types";

/**
 * Проверка поля по декларативным правилам.
 * Возвращает текст первой сработавшей ошибки или null.
 */
export function validateValue(
  rules: readonly ValidationRule[],
  raw: string,
): string | null {
  const value = raw.trim();

  for (const rule of rules) {
    switch (rule.kind) {
      case "required":
        if (value.length === 0) return rule.message;
        break;

      case "minLength":
        if (value.length < rule.value) return rule.message;
        break;

      case "phone":
        if (!isValidPhone(value)) return rule.message;
        break;
    }
  }

  return null;
}

/** «Шаг {current} из {total}» + { current: 2, total: 4 } → «Шаг 2 из 4». */
export function fillTemplate(
  template: string,
  values: Readonly<Record<string, string | number>>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
