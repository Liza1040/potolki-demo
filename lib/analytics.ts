import type { QuizEvent } from "@/components/quiz/types";

/**
 * Типизированная обёртка над Яндекс.Метрикой.
 * Счётчика нет — функции молча ничего не делают, поэтому вызывать их
 * можно откуда угодно без проверок.
 *
 * Смысл событий: клиент видит, на каком шаге квиза отваливаются люди.
 */

declare global {
  interface Window {
    ym?: (counterId: number, action: string, ...args: unknown[]) => void;
  }
}

/** Отправка любой формы. source различает квиз и короткую форму. */
export interface FormSubmitEvent {
  readonly name: "form_submit";
  readonly source: "quiz" | "final-form";
}

export type AnalyticsEvent = QuizEvent | FormSubmitEvent;

const counterId = Number(process.env.NEXT_PUBLIC_METRIKA_ID);

export const METRIKA_ID: number | null = Number.isFinite(counterId) && counterId > 0
  ? counterId
  : null;

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  const params =
    event.name === "quiz_step_complete"
      ? { step: event.step, step_id: event.stepId }
      : event.name === "form_submit"
        ? { source: event.source }
        : undefined;

  if (METRIKA_ID !== null && typeof window.ym === "function") {
    window.ym(METRIKA_ID, "reachGoal", event.name, params);
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", event.name, params ?? "");
  }
}
