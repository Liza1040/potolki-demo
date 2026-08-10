import { applyPhoneMask } from "@/lib/phone";
import type { Answers, FormStep } from "../types";

interface FormStepViewProps {
  readonly step: FormStep;
  readonly answers: Answers;
  readonly errors: Readonly<Record<string, string>>;
  readonly disabled: boolean;
  readonly onChange: (id: string, value: string) => void;
}

export function FormStepView({
  step,
  answers,
  errors,
  disabled,
  onChange,
}: FormStepViewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {step.fields.map((field) => {
        const raw = answers[field.id];
        const value = typeof raw === "string" ? raw : "";
        const error = errors[field.id];
        const errorId = `${field.id}-error`;

        return (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className="mb-1.5 block text-[14px] font-bold text-ink"
            >
              {field.label}
            </label>

            <input
              id={field.id}
              name={field.id}
              type={field.format === "phone" ? "tel" : "text"}
              inputMode={field.inputMode}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              value={value}
              disabled={disabled}
              aria-invalid={error !== undefined}
              aria-describedby={error !== undefined ? errorId : undefined}
              onChange={(event) => {
                const next =
                  field.format === "phone"
                    ? applyPhoneMask(event.target.value, value)
                    : event.target.value;
                onChange(field.id, next);
              }}
              className={
                "h-13 min-h-12 w-full rounded-xl border-2 bg-field px-4 text-[16px] " +
                "font-medium text-ink outline-none transition-colors " +
                // Плейсхолдер без прозрачности: muted/60 на тёмной теме
                // опускает контраст примерно до 3:1
                "placeholder:text-muted focus:border-brand " +
                "disabled:bg-elevated disabled:text-muted " +
                (error !== undefined ? "border-danger-border" : "border-control")
              }
            />

            {error !== undefined && (
              <p id={errorId} className="mt-1.5 text-[13px] font-medium text-danger">
                {error}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
