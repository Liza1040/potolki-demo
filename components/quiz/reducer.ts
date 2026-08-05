import type { Answers, QuizAction, QuizConfig, QuizState, QuizStep } from "./types";
import { validateValue } from "./validation";

export function createInitialState(): QuizState {
  return {
    stepIndex: 0,
    answers: {},
    errors: {},
    status: "idle",
    started: false,
  };
}

/**
 * Проверяет один шаг. Возвращает ошибки по id поля (для form) или по id шага.
 * Пустой объект — шаг заполнен корректно.
 *
 * Вынесено из редьюсера наружу: компоненту нужно знать результат проверки,
 * чтобы не отправлять quiz_step_complete на неудачном переходе.
 */
export function validateStep(
  step: QuizStep,
  answers: Answers,
): Readonly<Record<string, string>> {
  const errors: Record<string, string> = {};

  switch (step.kind) {
    case "choice": {
      if (typeof answers[step.id] !== "string") {
        errors[step.id] = step.requiredMessage;
      }
      break;
    }

    case "number": {
      const value = answers[step.id];
      const isValid =
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= step.min &&
        value <= step.max;

      if (!isValid) {
        errors[step.id] = step.invalidMessage;
      }
      break;
    }

    case "form": {
      for (const field of step.fields) {
        const raw = answers[field.id];
        const message = validateValue(field.rules, typeof raw === "string" ? raw : "");
        if (message !== null) {
          errors[field.id] = message;
        }
      }
      break;
    }
  }

  return errors;
}

export function isStepComplete(step: QuizStep, answers: Answers): boolean {
  return Object.keys(validateStep(step, answers)).length === 0;
}

export function createQuizReducer(config: QuizConfig) {
  const lastIndex = config.steps.length - 1;

  return function quizReducer(state: QuizState, action: QuizAction): QuizState {
    switch (action.type) {
      case "answer": {
        // Ошибку поля гасим сразу, как только его поправили
        const restErrors = { ...state.errors };
        delete restErrors[action.id];

        return {
          ...state,
          started: true,
          answers: { ...state.answers, [action.id]: action.value },
          errors: restErrors,
        };
      }

      case "next": {
        const step = config.steps[state.stepIndex];
        if (step === undefined) return state;

        const errors = validateStep(step, state.answers);
        if (Object.keys(errors).length > 0) {
          return { ...state, errors };
        }

        return {
          ...state,
          stepIndex: Math.min(state.stepIndex + 1, lastIndex),
          errors: {},
        };
      }

      case "back": {
        // Ответы намеренно не чистим: вернулся, поправил, пошёл дальше
        return {
          ...state,
          stepIndex: Math.max(state.stepIndex - 1, 0),
          errors: {},
        };
      }

      case "submit/start":
        return { ...state, status: "loading", errors: {} };

      case "submit/success":
        return { ...state, status: "success" };

      case "submit/error":
        // Ответы остаются на месте — пользователь не вводит всё заново
        return { ...state, status: "error" };

      default:
        return state;
    }
  };
}
