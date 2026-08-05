"use client";

import { useId, useState } from "react";

import type { FinalCtaContent, LegalContent } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ConsentNote } from "@/components/ui/ConsentNote";
import { applyPhoneMask, isValidPhone, toE164 } from "@/lib/phone";
import { track } from "@/lib/analytics";

interface FinalCtaProps {
  readonly content: FinalCtaContent;
  readonly legal: LegalContent;
}

type Status = "idle" | "loading" | "success" | "error";

const MIN_NAME_LENGTH = 2;

/**
 * Короткая форма имя + телефон. Маска и валидация — те же, что в квизе
 * (lib/phone), логика не дублируется. Отправка в /api/lead с
 * source: "final-form", чтобы клиент различал источники заявок.
 */
export function FinalCta({ content, legal }: FinalCtaProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [status, setStatus] = useState<Status>("idle");

  const fieldId = useId();
  const nameId = `${fieldId}-name`;
  const phoneId = `${fieldId}-phone`;

  function validate() {
    const next: { name?: string; phone?: string } = {};
    if (name.trim().length < MIN_NAME_LENGTH) next.name = content.nameError;
    if (!isValidPhone(phone)) next.phone = content.phoneError;
    return next;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "loading") return; // защита от двойной отправки

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "final-form",
          name: name.trim(),
          phone: toE164(phone),
        }),
      });

      if (!response.ok) throw new Error(`Lead failed: ${response.status}`);

      track({ name: "form_submit", source: "final-form" });
      setStatus("success");
    } catch {
      // Введённое остаётся в полях — повтор без перенабора
      setStatus("error");
    }
  }

  return (
    <section id={content.id} className="scroll-mt-20 bg-brand py-14 sm:py-20">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          {/* ------------------------------ Текст ------------------------------ */}
          <div className="text-white">
            <p className="text-[13px] font-bold uppercase tracking-wide text-white/85">
              {content.eyebrow}
            </p>
            <h2 className="mt-2 text-balance text-[28px] font-extrabold leading-tight tracking-tight sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/85 sm:text-base">
              {content.subtitle}
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {content.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2 text-[14px] text-white/90">
                  <Icon name="check" className="size-4 shrink-0 text-cta" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          {/* ------------------------------ Форма ------------------------------ */}
          <div className="rounded-card bg-white p-5 shadow-lg sm:p-7">
            {status === "success" ? (
              <div role="status">
                <span className="flex size-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <Icon name="check" className="size-6" />
                </span>
                <h3 className="mt-4 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                  {content.successTitle}
                </h3>
                <ol className="mt-4 space-y-3">
                  {content.successSteps.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[13px] font-extrabold text-brand">
                        {index + 1}
                      </span>
                      <span className="min-w-0 text-[14px] leading-snug text-ink">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid gap-4">
                  <div>
                    <label
                      htmlFor={nameId}
                      className="mb-1.5 block text-[14px] font-bold text-ink"
                    >
                      {content.nameLabel}
                    </label>
                    <input
                      id={nameId}
                      name="name"
                      type="text"
                      inputMode="text"
                      autoComplete="given-name"
                      placeholder={content.namePlaceholder}
                      value={name}
                      disabled={status === "loading"}
                      aria-invalid={errors.name !== undefined}
                      aria-describedby={errors.name !== undefined ? `${nameId}-err` : undefined}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass(errors.name !== undefined)}
                    />
                    {errors.name !== undefined && (
                      <p id={`${nameId}-err`} className="mt-1.5 text-[13px] font-medium text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={phoneId}
                      className="mb-1.5 block text-[14px] font-bold text-ink"
                    >
                      {content.phoneLabel}
                    </label>
                    <input
                      id={phoneId}
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={content.phonePlaceholder}
                      value={phone}
                      disabled={status === "loading"}
                      aria-invalid={errors.phone !== undefined}
                      aria-describedby={errors.phone !== undefined ? `${phoneId}-err` : undefined}
                      onChange={(e) => setPhone(applyPhoneMask(e.target.value, phone))}
                      className={inputClass(errors.phone !== undefined)}
                    />
                    {errors.phone !== undefined && (
                      <p id={`${phoneId}-err`} className="mt-1.5 text-[13px] font-medium text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {status === "error" && (
                  <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-[14px] leading-snug text-red-700">
                      {content.errorText}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="cta"
                  disabled={status === "loading"}
                  className="mt-5 w-full"
                >
                  {status === "loading"
                    ? content.submittingLabel
                    : status === "error"
                      ? content.retryLabel
                      : content.submitLabel}
                </Button>

                <ConsentNote legal={legal} className="mt-4" />
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function inputClass(hasError: boolean): string {
  return (
    "h-13 min-h-12 w-full rounded-xl border-2 bg-white px-4 text-[16px] font-medium " +
    "text-ink outline-none transition-colors placeholder:text-muted/60 " +
    "focus:border-brand disabled:bg-surface disabled:text-muted " +
    (hasError ? "border-red-500" : "border-line")
  );
}
