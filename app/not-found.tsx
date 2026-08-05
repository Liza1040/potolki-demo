import type { Metadata } from "next";
import Link from "next/link";

import { content } from "@/content";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Страница не найдена — Потолки Первый Метр",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const { business404 } = content;

  return (
    <main className="flex min-h-[70vh] items-center bg-surface py-16">
      <Container className="max-w-xl text-center">
        <p className="text-[64px] font-extrabold leading-none tracking-tight text-brand/25 sm:text-[88px]">
          {business404.code}
        </p>

        <h1 className="mt-3 text-[26px] font-extrabold tracking-tight text-ink sm:text-4xl">
          {business404.title}
        </h1>

        <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-base">
          {business404.text}
        </p>

        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-cta px-6 text-base font-bold text-ink transition-colors hover:bg-cta-dark sm:w-auto"
          >
            {business404.homeLabel}
          </Link>

          <a
            href={content.footer.phone.href}
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 text-base font-bold text-ink transition-colors hover:border-brand hover:text-brand sm:w-auto"
          >
            <Icon name="phone" className="size-4" />
            {content.footer.phone.label}
          </a>
        </div>
      </Container>
    </main>
  );
}
