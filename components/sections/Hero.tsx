import type { HeroContent } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

interface HeroProps {
  readonly content: HeroContent;
}

/** Мягкое пятно бренда рисуется градиентом в .hero-surface, а не blur-фильтром. */
export function Hero({ content }: HeroProps) {
  const { badge, title, subtitle, primaryCta, secondaryCta, bullets, priceCard } =
    content;

  return (
    <section className="hero-surface relative overflow-hidden pb-12 pt-8 sm:pb-16 sm:pt-12 lg:pb-20">
      <Container className="relative">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-12">
          {/* ------------------------------ Текст ------------------------------ */}
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-medium text-muted">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full bg-green-500"
              />
              {badge}
            </p>

            <h1 className="mt-4 text-[30px] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-[52px]">
              {title}
            </h1>

            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted sm:text-lg">
              {subtitle}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <LinkButton href={primaryCta.href} variant="cta" size="lg">
                {primaryCta.label}
              </LinkButton>
              <LinkButton href={secondaryCta.href} variant="ghost" size="lg">
                {secondaryCta.label}
              </LinkButton>
            </div>

            <ul className="mt-9 grid gap-4 sm:grid-cols-3 sm:gap-5">
              {bullets.map((bullet) => (
                <li key={bullet.title} className="flex gap-3 sm:flex-col sm:gap-2">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand shadow-sm ring-1 ring-line">
                    <Icon name={bullet.icon} className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-bold leading-snug text-ink">
                      {bullet.title}
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                      {bullet.note}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* --------------------------- Карточка цены -------------------------- */}
          <aside className="rounded-card border border-line bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[13px] font-bold uppercase tracking-wide text-muted">
              {priceCard.label}
            </p>

            <p className="mt-2 flex items-baseline gap-2">
              <span className="text-[44px] font-extrabold leading-none tracking-tight text-ink">
                {priceCard.value}
              </span>
              <span className="text-lg font-bold text-muted">{priceCard.unit}</span>
            </p>

            <p className="mt-2 text-[14px] leading-snug text-muted">
              {priceCard.caption}
            </p>

            <hr className="my-5 border-line" />

            <p className="text-[14px] font-bold text-ink">
              {priceCard.includedTitle}
            </p>

            <ul className="mt-3 space-y-2.5">
              {priceCard.included.map((item) => (
                <li key={item} className="flex gap-2.5 text-[14px] leading-snug text-ink">
                  <Icon name="check" className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 rounded-lg bg-surface px-3 py-2.5 text-[13px] leading-snug text-muted">
              {priceCard.footnote}
            </p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
