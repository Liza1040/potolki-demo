import type { WhyUsContent } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

interface WhyUsProps {
  readonly content: WhyUsContent;
}

/**
 * Опорный блок: каждая карточка снимает одно возражение (поле objection).
 * Намеренно сдержанный — это не главный экран, а поддержка доверия.
 */
export function WhyUs({ content }: WhyUsProps) {
  return (
    <section id={content.id} className="scroll-mt-20 bg-surface py-14 sm:py-20">
      <Container>
        <SectionHeading eyebrow={content.eyebrow} title={content.title} />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {content.cards.map((card) => (
            <li
              key={card.title}
              className="rounded-card border border-line bg-white p-5 sm:p-6"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Icon name={card.icon} className="size-6" />
              </span>

              <h3 className="mt-4 text-[16px] font-extrabold leading-snug text-ink">
                {card.title}
              </h3>

              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                {card.text}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
