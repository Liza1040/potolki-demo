"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ConsentNote } from "@/components/ui/ConsentNote";
import { Quiz } from "@/components/quiz/Quiz";
import { fillTemplate } from "@/components/quiz/validation";
import type { Answers, QuizEvent } from "@/components/quiz/types";
import type { LegalContent, QuizSectionContent } from "@/content/types";
import { calculateEstimate, formatRub } from "@/lib/estimate";
import { track } from "@/lib/analytics";
import { toE164 } from "@/lib/phone";

interface QuizSectionProps {
  readonly content: QuizSectionContent;
  readonly legal: LegalContent;
}

/**
 * Предметная обвязка вокруг движка: расчёт вилки и отправка заявки.
 * Всё, что знает про потолки, живёт здесь, а не в components/quiz.
 */
export function QuizSection({ content, legal }: QuizSectionProps) {
  const { estimate: estimateText } = content;

  function renderSummary(answers: Answers) {
    const estimate = calculateEstimate(answers);
    if (estimate === null) return null;

    return (
      <div className="rounded-xl border border-brand/20 bg-brand-soft p-4 sm:p-5">
        <p className="text-[13px] font-bold uppercase tracking-wide text-brand">
          {estimateText.title}
        </p>

        <p className="mt-1.5 text-[26px] font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
          {formatRub(estimate.min)} — {formatRub(estimate.max)}
        </p>

        <p className="mt-1 text-[14px] font-bold text-muted">
          {fillTemplate(estimateText.forArea, { area: estimate.area })} ·{" "}
          {estimate.roomLabel.toLowerCase()},{" "}
          {estimate.textureLabel.toLowerCase()}
        </p>

        <p className="mt-3 text-[13px] leading-snug text-muted">
          {estimateText.included}
        </p>

        <p className="mt-2 text-[13px] leading-snug text-muted">
          {estimateText.disclaimer}
        </p>
      </div>
    );
  }

  async function handleSubmit(answers: Answers) {
    const estimate = calculateEstimate(answers);
    const phone = typeof answers.phone === "string" ? answers.phone : "";

    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "quiz",
        name: typeof answers.name === "string" ? answers.name.trim() : "",
        phone: toE164(phone),
        answers: {
          room: answers.room,
          area: answers.area,
          texture: answers.texture,
        },
        estimate:
          estimate === null ? null : { min: estimate.min, max: estimate.max },
      }),
    });

    if (!response.ok) {
      throw new Error(`Lead request failed: ${response.status}`);
    }
  }

  function handleEvent(event: QuizEvent) {
    track(event);
  }

  return (
    <section id={content.id} className="scroll-mt-20 bg-white py-14 sm:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-12">
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            subtitle={content.subtitle}
            align="start"
          />

          <Quiz
            config={content.config}
            renderSummary={renderSummary}
            consentSlot={<ConsentNote legal={legal} />}
            onSubmit={handleSubmit}
            onEvent={handleEvent}
          />
        </div>
      </Container>
    </section>
  );
}
