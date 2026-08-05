import Script from "next/script";

import { METRIKA_ID } from "@/lib/analytics";

/**
 * Яндекс.Метрика.
 *
 * Без NEXT_PUBLIC_METRIKA_ID компонент не рендерит ничего — ни тега, ни
 * запроса. Демо и локальная разработка работают без счётчика.
 *
 * strategy="afterInteractive" — скрипт грузится после гидратации, вне
 * критического пути рендера, поэтому не портит LCP. lazyOnload был бы ещё
 * позже, но тогда теряются визиты тех, кто закрыл вкладку за пару секунд.
 *
 * <noscript> с пикселем оставлен намеренно: часть трафика из Директа
 * приходит с отключённым JS, и без пикселя эти визиты не считаются.
 */
export function YandexMetrika() {
  if (METRIKA_ID === null) return null;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {
              if (document.scripts[j].src === r) { return; }
            }
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],
            k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${METRIKA_ID}, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true
          });
        `}
      </Script>

      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${METRIKA_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
