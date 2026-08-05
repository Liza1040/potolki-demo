import type { ReviewsContent } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ReviewsProps {
  readonly content: ReviewsContent;
}

/**
 * Отзывы вертикальной сеткой, без карусели: на четырёх элементах свайп
 * только прячет часть отзывов. Каждый снимает возражение (поле objection).
 */
export function Reviews({ content }: ReviewsProps) {
  return (
    <section id={content.id} className="scroll-mt-20 bg-surface py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          subtitle={content.subtitle}
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5">
          {content.items.map((review) => (
            <li
              key={`${review.name}-${review.district}`}
              className="flex flex-col rounded-card border border-line bg-white p-5 sm:p-6"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[17px] font-extrabold text-brand"
                >
                  {review.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-extrabold leading-tight text-ink">
                    {review.name} {review.surnameInitial}
                  </p>
                  <p className="text-[13px] leading-tight text-muted">
                    {review.district} · {review.date}
                  </p>
                </div>
              </div>

              <p className="mt-4 grow text-[14px] leading-relaxed text-ink">
                {review.text}
              </p>

              <p className="mt-4 border-t border-line pt-3 text-[13px] font-bold text-muted">
                {review.job}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
