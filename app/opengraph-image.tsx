import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { business } from "@/content/business";
import { BASE_TEXTURE } from "@/content/prices";
import { content } from "@/content";

/**
 * OG-картинка 1200×630 — то, что видно в Telegram и соцсетях раньше сайта.
 *
 * Генерируется кодом через ImageResponse (satori под капотом: JSX + подмножество
 * CSS → SVG → PNG). Страница статическая, поэтому Next рендерит картинку
 * на этапе сборки и кладёт готовый PNG в бандл — рантайм на каждый шер
 * не дёргается.
 *
 * Шрифт читается из репозитория, а не тянется из сети: сборка не должна
 * падать из-за недоступности Google Fonts, а дефолтный шрифт satori
 * не покрывает кириллицу — были бы квадраты вместо букв.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = content.meta.ogTitle;

const fontsDir = join(process.cwd(), "assets", "fonts");
const manropeBold = readFileSync(join(fontsDir, "Manrope-ExtraBold.ttf"));
const manropeMedium = readFileSync(join(fontsDir, "Manrope-Medium.ttf"));

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1D4ED8",
          padding: "72px 80px",
          fontFamily: "Manrope",
          // Мягкое пятно, чтобы фон не был плоской заливкой
          backgroundImage:
            "radial-gradient(circle at 85% 15%, #2563EB 0%, #1D4ED8 55%)",
        }}
      >
        {/* Шапка: логотип и название */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 18,
              backgroundColor: "#FFFFFF",
              color: "#1D4ED8",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            {business.logoMark}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 800,
              color: "#FFFFFF",
            }}
          >
            {business.name}
          </div>
        </div>

        {/* Оффер */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            Натяжной потолок за 1 день
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 40,
              fontWeight: 500,
              color: "#DBEAFE",
            }}
          >
            Цена фиксируется в договоре и не растёт при монтаже
          </div>
        </div>

        {/* Подвал: цена и гео */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "18px 32px",
              borderRadius: 999,
              backgroundColor: "#F59E0B",
              color: "#101828",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            от {BASE_TEXTURE.rate} ₽ за м²
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 500,
              color: "#FFFFFF",
            }}
          >
            {business.address.city} и область
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Manrope", data: manropeBold, weight: 800, style: "normal" },
        { name: "Manrope", data: manropeMedium, weight: 500, style: "normal" },
      ],
    },
  );
}
