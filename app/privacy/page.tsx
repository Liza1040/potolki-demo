import type { Metadata } from "next";

import { content } from "@/content";
import { LegalPage } from "@/components/layout/LegalPage";

const page = content.legal.privacyPage;

export const metadata: Metadata = {
  title: `${page.title} — ${content.footer.company}`,
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      content={page}
      companyName={content.footer.company}
      backLabel={content.legal.backLabel}
    />
  );
}
