import type { ReactNode } from "react";

interface SectionHeadingProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle?: string;
  /** center — для секций во всю ширину, start — для двухколоночных. */
  readonly align?: "center" | "start";
  readonly children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  children,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-[13px] font-bold uppercase tracking-wide text-brand">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-balance text-[26px] font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {subtitle !== undefined && (
        <p
          className={
            "mt-3 text-[15px] leading-relaxed text-muted sm:text-base" +
            (isCenter ? " mx-auto" : "")
          }
        >
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
