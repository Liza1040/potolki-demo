import { NextResponse } from "next/server";

import { findRoom, findTexture } from "@/content/prices";

/**
 * Приём заявок из квиза и короткой формы.
 *
 * Есть TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID — отправляем в Telegram.
 * Нет — пишем в консоль и отвечаем успехом, чтобы демо работало из коробки.
 */

interface LeadPayload {
  source: string;
  name: string;
  phone: string;
  answers?: {
    room?: unknown;
    area?: unknown;
    texture?: unknown;
  };
  estimate?: { min: number; max: number } | null;
}

const PHONE_PATTERN = /^\+7\d{10}$/;
const MAX_NAME_LENGTH = 60;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Никому не доверяем: то же самое проверяем на сервере. */
function parseLead(raw: unknown): LeadPayload | null {
  if (!isRecord(raw)) return null;

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const phone = typeof raw.phone === "string" ? raw.phone.trim() : "";
  const source = typeof raw.source === "string" ? raw.source : "unknown";

  if (name.length < 2 || name.length > MAX_NAME_LENGTH) return null;
  if (!PHONE_PATTERN.test(phone)) return null;

  const answers = isRecord(raw.answers) ? raw.answers : undefined;

  const estimate =
    isRecord(raw.estimate) &&
    typeof raw.estimate.min === "number" &&
    typeof raw.estimate.max === "number"
      ? { min: raw.estimate.min, max: raw.estimate.max }
      : null;

  return { source, name, phone, answers, estimate };
}

function formatMessage(lead: LeadPayload): string {
  const lines = [
    "🔔 Заявка с сайта",
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    `Форма: ${lead.source}`,
  ];

  const room =
    typeof lead.answers?.room === "string" ? findRoom(lead.answers.room) : undefined;
  const texture =
    typeof lead.answers?.texture === "string"
      ? findTexture(lead.answers.texture)
      : undefined;

  if (room !== undefined) lines.push(`Помещение: ${room.label}`);
  if (typeof lead.answers?.area === "number") {
    lines.push(`Площадь: ${lead.answers.area} м²`);
  }
  if (texture !== undefined) lines.push(`Фактура: ${texture.label}`);
  if (lead.estimate !== null && lead.estimate !== undefined) {
    lines.push(`Расчёт: ${lead.estimate.min}–${lead.estimate.max} ₽`);
  }

  return lines.join("\n");
}

async function sendToTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token === undefined || chatId === undefined) {
    console.info("[lead] Telegram не настроен, заявка только в логе:\n%s", text);
    return true;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!response.ok) {
      console.error("[lead] Telegram ответил %s", response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[lead] Не удалось отправить в Telegram", error);
    return false;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const lead = parseLead(body);
  if (lead === null) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const delivered = await sendToTelegram(formatMessage(lead));
  if (!delivered) {
    return NextResponse.json({ ok: false, error: "delivery" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
