import type { HeaderContent } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

interface SiteHeaderProps {
  readonly content: HeaderContent;
}

/**
 * Сплошной фон вместо backdrop-blur: полупрозрачность с фильтром
 * заставляла браузер перерисовывать шапку на каждый кадр скролла.
 */
export function SiteHeader({ content }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between gap-3 sm:gap-4">
          <a href="#top" className="flex min-w-0 shrink-0 items-center gap-2">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand text-[13px] font-extrabold text-white"
            >
              {content.logoMark}
            </span>
            {/* Ниже 400px название не помещается рядом с телефоном */}
            <span className="hidden truncate text-[15px] font-extrabold leading-tight tracking-tight text-ink min-[400px]:block sm:text-base">
              {content.company}
            </span>
          </a>

          <nav aria-label="Разделы страницы" className="hidden xl:block">
            <ul className="flex items-center gap-6">
              {content.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="whitespace-nowrap text-[14px] font-medium text-muted transition-colors hover:text-brand"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-4">
            <a href={content.phone.href} className="text-right">
              <span className="block whitespace-nowrap text-[14px] font-extrabold leading-tight text-ink sm:text-base">
                {content.phone.label}
              </span>
              <span className="hidden whitespace-nowrap text-[12px] leading-tight text-muted sm:block">
                {content.schedule}
              </span>
            </a>

            {/* Прячем обёрткой, а не классом на кнопке: у Button display
                зашит в базовые классы и `hidden` снаружи его не перебьёт */}
            <span className="hidden lg:block">
              <LinkButton href={content.cta.href} variant="brand" size="md">
                {content.cta.label}
              </LinkButton>
            </span>
          </div>
        </div>
      </Container>
    </header>
  );
}
