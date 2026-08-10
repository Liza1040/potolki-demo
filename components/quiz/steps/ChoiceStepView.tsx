import { Icon } from "@/components/ui/Icon";
import type { ChoiceStep } from "../types";

interface ChoiceStepViewProps {
  readonly step: ChoiceStep;
  readonly value: string | undefined;
  readonly labelledBy: string;
  readonly onSelect: (value: string) => void;
}

export function ChoiceStepView({
  step,
  value,
  labelledBy,
  onSelect,
}: ChoiceStepViewProps) {
  return (
    <fieldset aria-labelledby={labelledBy}>
      <div className="grid gap-3 sm:grid-cols-2">
        {step.options.map((option) => {
          const checked = value === option.id;

          return (
            <label key={option.id} className="block cursor-pointer">
              <input
                type="radio"
                name={step.id}
                value={option.id}
                checked={checked}
                onChange={() => onSelect(option.id)}
                className="peer sr-only"
              />

              <span
                className={
                  "flex h-full items-start gap-3 rounded-xl border-2 bg-field p-4 " +
                  "transition-colors duration-150 " +
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-panel " +
                  // control, а не line: граница здесь единственный признак
                  // контрола, ей нужны 3:1 к фону (WCAG 1.4.11)
                  (checked
                    ? "border-brand bg-brand-soft"
                    : "border-control hover:border-brand/60")
                }
              >
                {option.icon !== undefined && (
                  <span
                    className={
                      "flex size-10 shrink-0 items-center justify-center rounded-lg " +
                      (checked ? "bg-brand text-on-brand" : "bg-elevated text-brand")
                    }
                  >
                    <Icon name={option.icon} className="size-5" />
                  </span>
                )}

                <span className="min-w-0">
                  <span className="block text-[15px] font-bold leading-snug text-ink">
                    {option.label}
                  </span>
                  {option.note !== undefined && (
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                      {option.note}
                    </span>
                  )}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
