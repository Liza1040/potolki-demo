import type { HowItWorksContent } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

interface HowItWorksProps {
  readonly content: HowItWorksContent;
}

/**
 * Снимает возражение №2 (грязь, шум, сроки). Работает именно тайминг:
 * он вынесен в заметную плашку на каждом шаге.
 * Мобильный — вертикальная лента, десктоп — горизонтальная (grid 1→4).
 */
export function HowItWorks({ content }: HowItWorksProps) {
  return (
    <section id={content.id} className="scroll-mt-20 bg-white py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          subtitle={content.subtitle}
        />

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {content.steps.map((step) => (
            <li
              key={step.number}
              className="relative flex flex-col rounded-card border border-line bg-white p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                {/* /70, а не /25: при более светлом номер не проходит
                    контраст 3:1 для крупного текста */}
                <span className="text-4xl font-extrabold leading-none tracking-tight text-brand/70 sm:text-5xl">
                  {step.number}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-[13px] font-bold text-brand">
                  <Icon name="clock" className="size-4" />
                  {step.timing}
                </span>
              </div>

              <h3 className="mt-4 text-[16px] font-extrabold leading-snug text-ink">
                {step.title}
              </h3>

              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                {step.text}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-[14px] leading-snug text-muted">{content.footnote}</p>
          <LinkButton
            href={content.cta.href}
            variant="cta"
            size="md"
            className="w-full shrink-0 sm:w-auto"
          >
            {content.cta.label}
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
