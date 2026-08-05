import type { FaqContent } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

interface FaqProps {
  readonly content: FaqContent;
}

/**
 * Аккордеон на нативных <details>/<summary>: раскрытие с клавиатуры работает
 * без JS, состояние доступно скринридеру, height не анимируется — CLS-скачков
 * нет. Первый вопрос открыт, чтобы было видно, что блок раскрывается.
 *
 * FAQPage JSON-LD отдаёт схему вопрос/ответ в поисковую выдачу.
 */
export function Faq({ content }: FaqProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section id={content.id} className="scroll-mt-20 bg-white py-14 sm:py-20">
      <script
        type="application/ld+json"
        // Схема для поисковиков — безопасный сериализованный объект
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container>
        <SectionHeading eyebrow={content.eyebrow} title={content.title} />

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {content.items.map((item, index) => (
            <details
              key={item.question}
              open={index === 0}
              className="group rounded-card border border-line bg-white open:border-brand/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span className="text-[15px] font-extrabold leading-snug text-ink sm:text-base">
                  {item.question}
                </span>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface text-muted transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none">
                  <Icon name="chevron" className="size-4" />
                </span>
              </summary>

              <div className="px-5 pb-5 text-[14px] leading-relaxed text-muted">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
