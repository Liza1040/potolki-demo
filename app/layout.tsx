import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";

import { content } from "@/content";
import { YandexMetrika } from "@/components/analytics/YandexMetrika";
import "./globals.css";

/**
 * Шрифт через next/font: файлы самохостятся из сборки (без запроса к
 * Google), в <head> добавляется preload, а font-display: swap не даёт
 * невидимого текста. Грузим ровно те начертания, что используются
 * в макете, — лишние веса это лишние килобайты.
 */
const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

const { meta } = content;

export const metadata: Metadata = {
  // Базовый адрес: от него достраиваются canonical и og:url
  metadataBase: new URL(meta.siteUrl),
  title: meta.title,
  description: meta.description,
  keywords: [...meta.keywords],
  applicationName: meta.organization.name,
  authors: [{ name: meta.organization.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: meta.organization.name,
    title: meta.ogTitle,
    description: meta.ogDescription,
    // og:image подставляется автоматически из app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: meta.ogTitle,
    description: meta.ogDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body className="antialiased">
        {children}
        <YandexMetrika />
      </body>
    </html>
  );
}
