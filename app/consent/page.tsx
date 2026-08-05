import type { Metadata } from "next";

import { content } from "@/content";
import { LegalPage } from "@/components/layout/LegalPage";

const page = content.legal.consentPage;

export const metadata: Metadata = {
  title: `${page.title} — ${content.footer.company}`,
  robots: { index: false, follow: true },
};

export default function ConsentPage() {
  return (
    <LegalPage
      content={page}
      companyName={content.footer.company}
      backLabel={content.legal.backLabel}
    />
  );
}
