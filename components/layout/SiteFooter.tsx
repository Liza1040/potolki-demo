import type { FooterContent } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

interface SiteFooterProps {
  readonly content: FooterContent;
}

export function SiteFooter({ content }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();
  const yearRange =
    currentYear > content.sinceYear
      ? `${content.sinceYear}—${currentYear}`
      : `${content.sinceYear}`;

  return (
    <footer className="border-t border-line bg-ink text-white/80">
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Компания */}
          <div>
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-lg bg-brand text-[13px] font-extrabold text-white"
              >
                {content.logoMark}
              </span>
              <span className="text-[15px] font-extrabold text-white">
                {content.company}
              </span>
            </div>
            <p className="mt-3 text-[13px] leading-snug text-white/60">
              {content.tagline}
            </p>
          </div>

          {/* Контакты */}
          <div>
            <p className="text-[13px] font-bold uppercase tracking-wide text-white/50">
              {content.columns.contacts}
            </p>
            <a
              href={content.phone.href}
              className="mt-3 flex items-center gap-2 text-[17px] font-extrabold text-white hover:text-cta"
            >
              <Icon name="phone" className="size-4" />
              {content.phone.label}
            </a>
            <a
              href={content.email.href}
              className="mt-2 block text-[14px] text-white/80 hover:text-white"
            >
              {content.email.label}
            </a>
            <ul className="mt-3 flex gap-3">
              {content.messengers.map((m) => (
                <li key={m.href}>
                  <a
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex min-h-9 items-center rounded-lg border border-white/20 px-3 text-[13px] font-bold text-white/90 hover:border-cta hover:text-cta"
                  >
                    {m.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Разделы */}
          <nav aria-label={content.columns.sections}>
            <p className="text-[13px] font-bold uppercase tracking-wide text-white/50">
              {content.columns.sections}
            </p>
            <ul className="mt-3 space-y-2">
              {content.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-[14px] text-white/80 hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Работаем */}
          <div>
            <p className="text-[13px] font-bold uppercase tracking-wide text-white/50">
              {content.columns.working}
            </p>
            <p className="mt-3 text-[14px] leading-snug text-white/80">
              {content.schedule}
            </p>
            <p className="mt-2 text-[14px] leading-snug text-white/80">
              {content.serviceArea}
            </p>
            <p className="mt-2 text-[13px] leading-snug text-white/60">
              {content.address}
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-[13px] leading-snug text-white/50">
            {content.requisites}
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-white/50">
              © {yearRange} {content.company}
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {content.legalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[13px] text-white/70 underline underline-offset-2 hover:text-white hover:no-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-[12px] leading-snug text-white/55">
            {content.disclaimer}
          </p>
        </div>
      </Container>
    </footer>
  );
}
