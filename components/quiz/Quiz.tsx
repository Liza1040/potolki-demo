"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProgressBar } from "./ProgressBar";
import { ChoiceStepView } from "./steps/ChoiceStepView";
import { NumberStepView } from "./steps/NumberStepView";
import { FormStepView } from "./steps/FormStepView";
import { createInitialState, createQuizReducer, isStepComplete } from "./reducer";
import { fillTemplate } from "./validation";
import type { AnswerValue, QuizProps } from "./types";

/** Пауза после выбора варианта: чтобы выбор было видно до смены шага. */
const AUTO_ADVANCE_MS = 320;

export function Quiz({
  config,
  renderSummary,
  consentSlot,
  onSubmit,
  onEvent,
}: QuizProps) {
  const reducer = useMemo(() => createQuizReducer(config), [config]);
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // На первом рендере фокус не перехватываем — иначе страница прыгнет к квизу
  const isFirstRender = useRef(true);

  const step = config.steps[state.stepIndex];
  const total = config.steps.length;
  const stepNumber = state.stepIndex + 1;
  const isLastStep = state.stepIndex === total - 1;
  const headingId = `${config.id}-step-title`;

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimer.current !== null) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  }, []);

  useEffect(() => clearAutoAdvance, [clearAutoAdvance]);

  // Фокус на заголовок нового шага: со скринридером и клавиатуры не теряемся
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [state.stepIndex, state.status]);

  const complete = step !== undefined && isStepComplete(step, state.answers);

  const goNext = useCallback(() => {
    clearAutoAdvance();
    if (step === undefined) return;

    if (isStepComplete(step, state.answers)) {
      onEvent?.({
        name: "quiz_step_complete",
        step: stepNumber,
        stepId: step.id,
      });
    }

    // Редьюсер сам проверит шаг: невалидный — покажет ошибки и не пустит дальше
    dispatch({ type: "next" });
  }, [clearAutoAdvance, onEvent, state.answers, step, stepNumber]);

  const handleAnswer = useCallback(
    (id: string, value: AnswerValue) => {
      if (!state.started) {
        onEvent?.({ name: "quiz_start" });
      }
      dispatch({ type: "answer", id, value });
    },
    [onEvent, state.started],
  );

  const handleChoice = useCallback(
    (value: string) => {
      if (step === undefined) return;

      handleAnswer(step.id, value);

      if (step.kind === "choice" && step.autoAdvance === true && !isLastStep) {
        clearAutoAdvance();
        autoAdvanceTimer.current = setTimeout(() => {
          onEvent?.({
            name: "quiz_step_complete",
            step: stepNumber,
            stepId: step.id,
          });
          dispatch({ type: "next" });
        }, AUTO_ADVANCE_MS);
      }
    },
    [clearAutoAdvance, handleAnswer, isLastStep, onEvent, step, stepNumber],
  );

  const handleSubmit = useCallback(async () => {
    if (step === undefined || state.status === "loading") return;

    if (!isStepComplete(step, state.answers)) {
      dispatch({ type: "next" }); // на последнем шаге только покажет ошибки
      return;
    }

    dispatch({ type: "submit/start" });

    try {
      await onSubmit(state.answers);
      onEvent?.({ name: "quiz_submit" });
      dispatch({ type: "submit/success" });
    } catch {
      // Ответы остаются в состоянии — вводить заново не придётся
      dispatch({ type: "submit/error" });
    }
  }, [onEvent, onSubmit, state.answers, state.status, step]);

  if (step === undefined) return null;

  /* ------------------------------- успех -------------------------------- */

  if (state.status === "success") {
    return (
      <div className="quiz-step-enter rounded-card border border-line bg-white p-5 shadow-sm sm:p-8">
        <span className="flex size-12 items-center justify-center rounded-full bg-green-100 text-green-700">
          <Icon name="check" className="size-6" />
        </span>

        <h3
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 text-2xl font-extrabold tracking-tight text-ink outline-none sm:text-3xl"
        >
          {config.success.title}
        </h3>

        <ol className="mt-5 space-y-3">
          {config.success.steps.map((item, index) => (
            <li key={item} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[13px] font-extrabold text-brand">
                {index + 1}
              </span>
              <span className="min-w-0 text-[15px] leading-snug text-ink">{item}</span>
            </li>
          ))}
        </ol>

        <p className="mt-5 rounded-lg bg-surface px-4 py-3 text-[14px] leading-snug text-muted">
          {config.success.note}
        </p>
      </div>
    );
  }

  /* -------------------------------- шаги -------------------------------- */

  const summary = step.showSummary === true ? renderSummary?.(state.answers) : null;

  return (
    <div className="rounded-card border border-line bg-white p-5 shadow-sm sm:p-8">
      <ProgressBar
        current={stepNumber}
        total={total}
        label={fillTemplate(config.ui.progress, {
          current: stepNumber,
          total,
        })}
      />

      {/* Смену шага объявляем отдельно от визуального заголовка */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {fillTemplate(config.ui.stepAnnouncement, {
          current: stepNumber,
          total,
          title: step.title,
        })}
      </p>

      {/* Минимальная высота держит кнопки на месте при смене шагов */}
      <div className="mt-6 min-h-[24rem] sm:min-h-[21rem]">
        <div key={step.id} className="quiz-step-enter">
          <h3
            id={headingId}
            ref={headingRef}
            tabIndex={-1}
            className="text-xl font-extrabold tracking-tight text-ink outline-none sm:text-2xl"
          >
            {step.title}
          </h3>

          {step.hint !== undefined && (
            <p className="mt-1.5 text-[14px] leading-snug text-muted">{step.hint}</p>
          )}

          {summary !== null && summary !== undefined && (
            <div className="mt-5">{summary}</div>
          )}

          <div className="mt-5">
            {step.kind === "choice" && (
              <>
                <ChoiceStepView
                  step={step}
                  value={
                    typeof state.answers[step.id] === "string"
                      ? (state.answers[step.id] as string)
                      : undefined
                  }
                  labelledBy={headingId}
                  onSelect={handleChoice}
                />
                {state.errors[step.id] !== undefined && (
                  <p className="mt-3 text-[14px] font-medium text-red-600">
                    {state.errors[step.id]}
                  </p>
                )}
              </>
            )}

            {step.kind === "number" && (
              <NumberStepView
                step={step}
                value={
                  typeof state.answers[step.id] === "number"
                    ? (state.answers[step.id] as number)
                    : undefined
                }
                error={state.errors[step.id]}
                onChange={(value) =>
                  handleAnswer(step.id, value === undefined ? "" : value)
                }
              />
            )}

            {step.kind === "form" && (
              <>
                <FormStepView
                  step={step}
                  answers={state.answers}
                  errors={state.errors}
                  disabled={state.status === "loading"}
                  onChange={handleAnswer}
                />

                {state.status === "error" && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4"
                  >
                    <p className="text-[15px] font-bold text-red-700">
                      {config.ui.errorTitle}
                    </p>
                    <p className="mt-1 text-[14px] leading-snug text-red-700/90">
                      {config.ui.errorText}
                    </p>
                  </div>
                )}

                <p className="mt-4 text-[13px] leading-snug text-muted">
                  {step.consent}
                </p>

                {consentSlot !== undefined && <div className="mt-2">{consentSlot}</div>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ----------------------------- навигация ---------------------------- */}

      <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row-reverse sm:items-center sm:justify-start">
        {step.kind === "form" ? (
          <Button
            variant="cta"
            onClick={() => void handleSubmit()}
            disabled={state.status === "loading"}
            className="w-full sm:w-auto"
          >
            {state.status === "loading"
              ? step.submittingLabel
              : state.status === "error"
                ? config.ui.retry
                : step.submitLabel}
          </Button>
        ) : (
          <Button
            variant="cta"
            onClick={goNext}
            disabled={!complete}
            className="w-full sm:w-auto"
          >
            {config.ui.next}
          </Button>
        )}

        {state.stepIndex > 0 && (
          <Button
            variant="ghost"
            onClick={() => {
              clearAutoAdvance();
              dispatch({ type: "back" });
            }}
            disabled={state.status === "loading"}
            className="w-full sm:mr-auto sm:w-auto"
          >
            {config.ui.back}
          </Button>
        )}
      </div>
    </div>
  );
}
