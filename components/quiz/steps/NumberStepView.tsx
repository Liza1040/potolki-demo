import type { NumberStep } from "../types";

interface NumberStepViewProps {
  readonly step: NumberStep;
  readonly value: number | undefined;
  readonly error: string | undefined;
  readonly onChange: (value: number | undefined) => void;
}

export function NumberStepView({
  step,
  value,
  error,
  onChange,
}: NumberStepViewProps) {
  const errorId = `${step.id}-error`;

  return (
    <div>
      <div className="relative">
        <input
          id={step.id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={value ?? ""}
          placeholder={step.placeholder}
          aria-label={step.title}
          aria-invalid={error !== undefined}
          aria-describedby={error !== undefined ? errorId : undefined}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "").slice(0, 3);
            onChange(digits === "" ? undefined : Number(digits));
          }}
          className={
            "h-16 w-full rounded-xl border-2 bg-white pl-4 pr-16 text-2xl font-extrabold " +
            "text-ink outline-none transition-colors placeholder:font-bold " +
            "placeholder:text-muted/50 focus:border-brand " +
            (error !== undefined ? "border-red-500" : "border-line")
          }
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted">
          {step.unit}
        </span>
      </div>

      {step.presets !== undefined && (
        <div className="mt-3 flex flex-wrap gap-2">
          {step.presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.value)}
              aria-pressed={value === preset.value}
              className={
                "min-h-11 rounded-lg border px-4 text-[14px] font-bold " +
                "transition-colors " +
                (value === preset.value
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-line bg-white text-ink hover:border-brand/40")
              }
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {error !== undefined && (
        <p id={errorId} className="mt-3 text-[14px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
