import Link from "next/link";

import type { LegalPageContent } from "@/content/types";
import { Container } from "@/components/ui/Container";

interface LegalPageProps {
  readonly content: LegalPageContent;
  readonly companyName: string;
  readonly backLabel: string;
}

/** Шаблон юридической страницы. Переиспользуется политикой и согласием. */
export function LegalPage({ content, companyName, backLabel }: LegalPageProps) {
  return (
    <main className="bg-white py-12 sm:py-16">
      <Container className="max-w-3xl">
        <Link
          href="/"
          className="text-[14px] font-bold text-brand hover:underline"
        >
          {backLabel}
        </Link>

        <h1 className="mt-6 text-[26px] font-extrabold tracking-tight text-ink sm:text-4xl">
          {content.title}
        </h1>
        <p className="mt-2 text-[14px] text-muted">
          {companyName} · {content.updated}
        </p>

        <p className="mt-6 text-[15px] leading-relaxed text-ink">{content.intro}</p>

        <div className="mt-8 space-y-8">
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[18px] font-extrabold tracking-tight text-ink">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-[15px] leading-relaxed text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </main>
  );
}
