/**
 * Типы движка квиза.
 *
 * Здесь нет ничего про потолки: движок умеет шаги, навигацию, валидацию и
 * отправку. Предметная часть подключается через renderSummary и onSubmit.
 * Пятый шаг в другом проекте — это правка конфига, а не движка.
 */

import type { ReactNode } from "react";

import type { IconName } from "@/content/types";

export type AnswerValue = string | number;
export type Answers = Readonly<Record<string, AnswerValue>>;

/* ---------------------------------- шаги ---------------------------------- */

interface StepBase {
  readonly id: string;
  readonly title: string;
  readonly hint?: string;
  /** Показать слот расчёта над содержимым шага. Что рисовать — решает хост. */
  readonly showSummary?: boolean;
}

export interface ChoiceOption {
  readonly id: string;
  readonly label: string;
  readonly note?: string;
  readonly icon?: IconName;
}

export interface ChoiceStep extends StepBase {
  readonly kind: "choice";
  readonly options: readonly ChoiceOption[];
  /** Выбор варианта сам ведёт вперёд — с задержкой, чтобы выбор было видно. */
  readonly autoAdvance?: boolean;
  readonly requiredMessage: string;
}

export interface NumberStep extends StepBase {
  readonly kind: "number";
  readonly unit: string;
  readonly min: number;
  readonly max: number;
  readonly placeholder: string;
  readonly invalidMessage: string;
  readonly presets?: readonly {
    readonly label: string;
    readonly value: number;
  }[];
}

/**
 * Правила валидации — данные, а не функции: конфиг обязан пережить
 * сериализацию при передаче из серверного компонента в клиентский.
 */
export type ValidationRule =
  | { readonly kind: "required"; readonly message: string }
  | { readonly kind: "minLength"; readonly value: number; readonly message: string }
  | { readonly kind: "phone"; readonly message: string };

export interface QuizField {
  readonly id: string;
  readonly label: string;
  readonly placeholder: string;
  /** phone включает маску ввода. */
  readonly format: "text" | "phone";
  readonly inputMode: "text" | "tel" | "numeric";
  readonly autoComplete?: string;
  /** Проверяются только при попытке перехода, не во время ввода. */
  readonly rules: readonly ValidationRule[];
}

export interface FormStep extends StepBase {
  readonly kind: "form";
  readonly fields: readonly QuizField[];
  readonly submitLabel: string;
  readonly submittingLabel: string;
  readonly consent: string;
}

export type QuizStep = ChoiceStep | NumberStep | FormStep;

/* -------------------------------- конфиг ---------------------------------- */

export interface QuizUiText {
  readonly back: string;
  readonly next: string;
  /** Шаблон с плейсхолдерами {current} и {total}. */
  readonly progress: string;
  /** Читается скринридером при смене шага: {current}, {total}, {title}. */
  readonly stepAnnouncement: string;
  readonly errorTitle: string;
  readonly errorText: string;
  readonly retry: string;
}

export interface QuizSuccess {
  readonly title: string;
  readonly steps: readonly string[];
  readonly note: string;
}

export interface QuizConfig {
  readonly id: string;
  readonly steps: readonly QuizStep[];
  readonly ui: QuizUiText;
  readonly success: QuizSuccess;
}

/* ------------------------------- состояние -------------------------------- */

export type SubmitStatus = "idle" | "loading" | "success" | "error";

export interface QuizState {
  readonly stepIndex: number;
  readonly answers: Answers;
  /** Пусто, пока не нажали «Далее»: ошибки не мигают во время ввода. */
  readonly errors: Readonly<Record<string, string>>;
  readonly status: SubmitStatus;
  /** Чтобы quiz_start ушёл ровно один раз. */
  readonly started: boolean;
}

export type QuizAction =
  | { readonly type: "answer"; readonly id: string; readonly value: AnswerValue }
  | { readonly type: "next" }
  | { readonly type: "back" }
  | { readonly type: "submit/start" }
  | { readonly type: "submit/success" }
  | { readonly type: "submit/error" };

/* ------------------------------- аналитика -------------------------------- */

export type QuizEvent =
  | { readonly name: "quiz_start" }
  | {
      readonly name: "quiz_step_complete";
      readonly step: number;
      readonly stepId: string;
    }
  | { readonly name: "quiz_submit" };

/* --------------------------------- пропсы --------------------------------- */

export interface QuizProps {
  readonly config: QuizConfig;
  /** Слот расчёта: рисуется на шагах с showSummary, до формы контактов. */
  readonly renderSummary?: (answers: Answers) => ReactNode;
  /** Слот согласия под формой контактов. Ссылки на документы задаёт хост. */
  readonly consentSlot?: ReactNode;
  readonly onSubmit: (answers: Answers) => Promise<void>;
  readonly onEvent?: (event: QuizEvent) => void;
}
