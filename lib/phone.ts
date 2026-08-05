/**
 * Маска российского номера: +7 (999) 123-45-67.
 * Без библиотеки — одно поле не стоит зависимости.
 */

const DIGITS = 10;

/** Оставляет максимум 10 цифр номера без кода страны. */
export function extractDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  // 8 999… и 7 999… — это код страны, а не первая цифра номера
  if (digits.startsWith("8") || digits.startsWith("7")) {
    digits = digits.slice(1);
  }

  return digits.slice(0, DIGITS);
}

export function formatPhone(raw: string): string {
  const digits = extractDigits(raw);
  if (digits.length === 0) return "";

  const parts = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 8),
    digits.slice(8, 10),
  ];

  let result = "+7";
  if (parts[0]) result += ` (${parts[0]}`;
  if (parts[0].length === 3) result += ")";
  if (parts[1]) result += ` ${parts[1]}`;
  if (parts[2]) result += `-${parts[2]}`;
  if (parts[3]) result += `-${parts[3]}`;

  return result;
}

/**
 * Реформатирование при вводе.
 *
 * Если пользователь удалил символ маски, набор цифр не изменился и
 * formatPhone вернёт ровно то же значение — backspace «залипнет» на скобке.
 * В этом случае убираем последнюю цифру: именно этого человек и ждёт.
 */
export function applyPhoneMask(next: string, previous: string): string {
  const isDeleting = next.length < previous.length;
  const nextDigits = extractDigits(next);

  if (isDeleting && nextDigits === extractDigits(previous)) {
    return formatPhone(nextDigits.slice(0, -1));
  }

  return formatPhone(next);
}

export function isValidPhone(raw: string): boolean {
  return extractDigits(raw).length === DIGITS;
}

/** Нормализованный вид для отправки: +79991234567. */
export function toE164(raw: string): string {
  const digits = extractDigits(raw);
  return digits.length === DIGITS ? `+7${digits}` : "";
}
