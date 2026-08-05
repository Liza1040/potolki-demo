import type { LegalContent } from "@/content/types";

interface ConsentNoteProps {
  readonly legal: LegalContent;
  readonly className?: string;
}

/**
 * Строка согласия со ссылками на документы. Одна на обе формы —
 * для российского лендинга обязательная часть.
 */
export function ConsentNote({ legal, className = "" }: ConsentNoteProps) {
  return (
    <p className={`text-[13px] leading-snug text-muted ${className}`}>
      {legal.consentLead}{" "}
      <a
        href={legal.privacyLink.href}
        className="font-medium text-brand underline underline-offset-2 hover:no-underline"
      >
        {legal.privacyLink.label}
      </a>{" "}
      и{" "}
      <a
        href={legal.consentLink.href}
        className="font-medium text-brand underline underline-offset-2 hover:no-underline"
      >
        {legal.consentLink.label}
      </a>
      .
    </p>
  );
}
