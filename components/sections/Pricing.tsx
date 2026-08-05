import type { PricingContent, PricingRow } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

interface PricingProps {
  readonly content: PricingContent;
}

function PopularBadge({ label }: { readonly label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-cta px-2.5 py-1 text-[12px] font-bold text-ink">
      {label}
    </span>
  );
}

/**
 * Снимает возражение №1 (доплаты) и №3 (разница фактур).
 * Цены — из content/prices.ts, дублей чисел нет.
 * Десктоп — таблица, мобильный — карточки: горизонтального скролла быть не должно.
 */
export function Pricing({ content }: PricingProps) {
  const { columns, rows, popularLabel } = content;

  return (
    <section id={content.id} className="scroll-mt-20 bg-surface py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          subtitle={content.subtitle}
        />

        {/* --------------------------- Таблица (lg+) --------------------------- */}
        <div className="mt-10 hidden overflow-hidden rounded-card border border-line bg-white lg:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-surface/60">
                <th className="px-5 py-4 text-[13px] font-bold uppercase tracking-wide text-muted">
                  {columns.texture}
                </th>
                <th className="px-5 py-4 text-[13px] font-bold uppercase tracking-wide text-muted">
                  {columns.price}
                </th>
                <th className="px-5 py-4 text-[13px] font-bold uppercase tracking-wide text-muted">
                  {columns.good}
                </th>
                <th className="px-5 py-4 text-[13px] font-bold uppercase tracking-wide text-muted">
                  {columns.caution}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.texture}
                  className={
                    "border-b border-line last:border-b-0 align-top " +
                    (row.highlighted === true ? "bg-brand-soft/50" : "")
                  }
                >
                  <td className="px-5 py-5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[15px] font-extrabold text-ink">
                        {row.texture}
                      </span>
                      {row.highlighted === true && (
                        <span>
                          <PopularBadge label={popularLabel} />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-5">
                    <span className="text-2xl font-extrabold tracking-tight text-ink">
                      {row.price}
                    </span>{" "}
                    <span className="text-[14px] font-bold text-muted">{row.unit}</span>
                  </td>
                  <td className="px-5 py-5 text-[14px] leading-snug text-muted">
                    {row.good}
                  </td>
                  <td className="px-5 py-5 text-[14px] leading-snug text-muted">
                    {row.caution}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* -------------------------- Карточки (мобайл) ------------------------ */}
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:hidden">
          {rows.map((row) => (
            <PricingCard
              key={row.texture}
              row={row}
              popularLabel={popularLabel}
              goodLabel={columns.good}
              cautionLabel={columns.caution}
            />
          ))}
        </ul>

        {/* --------------------- Что входит / что отдельно --------------------- */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5">
          <div className="rounded-card border border-line bg-white p-5 sm:p-6">
            <h3 className="text-[15px] font-extrabold text-ink">
              {content.includedTitle}
            </h3>
            <ul className="mt-3 space-y-2.5">
              {content.included.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-[14px] leading-snug text-ink"
                >
                  <Icon name="check" className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-card border border-line bg-white p-5 sm:p-6">
            <h3 className="text-[15px] font-extrabold text-ink">
              {content.extrasTitle}
            </h3>
            <ul className="mt-3 divide-y divide-line">
              {content.extras.map((extra) => (
                <li
                  key={extra.label}
                  className="flex items-baseline justify-between gap-4 py-2 text-[14px] leading-snug"
                >
                  <span className="min-w-0 text-muted">{extra.label}</span>
                  <span className="shrink-0 font-bold text-ink">{extra.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-5 rounded-xl bg-white px-4 py-3 text-[14px] leading-snug text-muted ring-1 ring-line">
          {content.note}
        </p>

        <div className="mt-8 flex justify-center">
          <LinkButton
            href={content.cta.href}
            variant="cta"
            size="lg"
            className="w-full sm:w-auto"
          >
            {content.cta.label}
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}

function PricingCard({
  row,
  popularLabel,
  goodLabel,
  cautionLabel,
}: {
  readonly row: PricingRow;
  readonly popularLabel: string;
  readonly goodLabel: string;
  readonly cautionLabel: string;
}) {
  const highlighted = row.highlighted === true;

  return (
    <li
      className={
        "rounded-card border-2 bg-white p-5 " +
        (highlighted ? "border-brand" : "border-line")
      }
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[16px] font-extrabold text-ink">{row.texture}</span>
        {highlighted && <PopularBadge label={popularLabel} />}
      </div>

      <p className="mt-2">
        <span className="text-3xl font-extrabold tracking-tight text-ink">
          {row.price}
        </span>{" "}
        <span className="text-[15px] font-bold text-muted">{row.unit}</span>
      </p>

      <dl className="mt-4 space-y-3">
        <div>
          <dt className="text-[12px] font-bold uppercase tracking-wide text-brand">
            {goodLabel}
          </dt>
          <dd className="mt-1 text-[14px] leading-snug text-muted">{row.good}</dd>
        </div>
        <div>
          <dt className="text-[12px] font-bold uppercase tracking-wide text-muted">
            {cautionLabel}
          </dt>
          <dd className="mt-1 text-[14px] leading-snug text-muted">{row.caution}</dd>
        </div>
      </dl>
    </li>
  );
}
