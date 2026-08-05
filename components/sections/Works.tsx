import Image from "next/image";

import type { WorksContent } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface WorksProps {
  readonly content: WorksContent;
}

/**
 * Галерея объектов. Фото кладутся в public/images/works/ (webp, 1200×900,
 * ориентация 4:3). До появления файла next/image покажет пустую плитку —
 * серый фон под изображением держит размер, поэтому CLS не скачет.
 *
 * Все кадры одного размера и соотношения, иначе сетка «поедет».
 */
const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 900;

export function Works({ content }: WorksProps) {
  return (
    <section id={content.id} className="scroll-mt-20 bg-white py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          subtitle={content.subtitle}
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {content.items.map((item) => (
            <li
              key={item.src}
              className="overflow-hidden rounded-card border border-line bg-white"
            >
              <div className="relative aspect-[4/3] w-full bg-surface">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={IMAGE_WIDTH}
                  height={IMAGE_HEIGHT}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="text-[15px] font-extrabold leading-snug text-ink">
                  {item.title}
                </h3>
                <p className="mt-1 text-[13px] leading-snug text-muted">{item.meta}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
