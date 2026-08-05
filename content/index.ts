import type { LandingContent } from "./types";

import { meta } from "./meta";
import { header } from "./header";
import { hero } from "./hero";
import { quiz } from "./quiz";
import { whyUs } from "./why-us";
import { howItWorks } from "./how-it-works";
import { pricing } from "./pricing";
import { works } from "./works";
import { reviews } from "./reviews";
import { faq } from "./faq";
import { finalCta } from "./final-cta";
import { footer } from "./footer";
import { legal } from "./legal";
import { business404 } from "./not-found";

export const content = {
  meta,
  header,
  hero,
  quiz,
  whyUs,
  howItWorks,
  pricing,
  works,
  reviews,
  faq,
  finalCta,
  footer,
  legal,
  business404,
} satisfies LandingContent;

export * from "./types";
