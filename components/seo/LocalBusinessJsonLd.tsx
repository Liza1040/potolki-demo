import { business } from "@/content/business";
import { content } from "@/content";

/**
 * LocalBusiness JSON-LD — карточка организации для поисковиков.
 * Все данные берутся из content/business.ts, то есть из того же источника,
 * что и футер: разъехаться телефон или часы работы не могут.
 *
 * FAQPage-схема живёт отдельно, в секции FAQ.
 */
export function LocalBusinessJsonLd() {
  const { meta } = content;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${meta.siteUrl}/#business`,
    name: business.name,
    legalName: business.legalName,
    url: meta.siteUrl,
    image: `${meta.siteUrl}/opengraph-image`,
    telephone: business.phone.e164,
    email: business.email.display,
    priceRange: meta.priceRange,
    currenciesAccepted: "RUB",
    paymentAccepted: "Наличные, банковская карта, перевод",
    foundingDate: String(business.sinceYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    areaServed: {
      "@type": "GeoCircle",
      description: business.serviceArea,
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: business.geo.latitude,
        longitude: business.geo.longitude,
      },
      geoRadius: 30000,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: business.hours.opens,
      closes: business.hours.closes,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
