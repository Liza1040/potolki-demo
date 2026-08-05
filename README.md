# Потолки Первый Метр — квиз-лендинг

Демо-проект для портфолио. Компания вымышленная, см. `BRIEF.md` и `NOTES.md`.
Подробный разбор архитектуры и технологий — в [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # продакшен-сборка
npm run start    # запуск собранного (только после build)
npm run lint     # eslint
npx tsc --noEmit # проверка типов
```

Метрики Lighthouse замеряют **только на `build` + `start`**: в dev-режиме
код не минифицирован и цифры недостоверны.

## Стек

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4 · Manrope
через `next/font` · деплой на Vercel. Внешних зависимостей нет.

## Как устроен проект

```
app/
  layout.tsx          шрифт, метатеги, OG, подключение Метрики
  page.tsx            собирает секции, передаёт им контент пропсами
  globals.css         токены темы (@theme) и базовые стили
  not-found.tsx       404
  privacy/, consent/  юридические страницы
  api/lead/route.ts   приём заявок → Telegram
  opengraph-image.tsx OG-картинка, генерируется на сборке
  icon.svg, apple-icon.png, favicon.ico
  manifest.ts, sitemap.ts, robots.ts
components/
  layout/    SiteHeader, SiteFooter, LegalPage
  sections/  секции лендинга, по одной на файл
  quiz/      движок квиза (не знает про потолки)
  ui/        Button, Container, Icon, SectionHeading, ConsentNote
  seo/       LocalBusinessJsonLd
  analytics/ YandexMetrika
content/     все тексты и данные
lib/         phone, estimate, analytics
docs/        отчёт Lighthouse, превью OG
```

**Тексты живут только в `content/`.** В разметке русских строк нет —
это позволяет переставлять секции и переиспользовать их в других проектах.
Секции контент сами не импортируют, получают его пропсом:

```tsx
<Hero content={content.hero} />
```

### Единые источники правды

Дублировать эти данные по файлам нельзя — они разъедутся:

| Файл | Что хранит | Кто использует |
|---|---|---|
| `content/prices.ts` | ставки ₽/м², множители помещений | квиз, таблица цен, hero, FAQ, meta |
| `content/business.ts` | телефон, адрес, часы, реквизиты, гео | шапка, футер, метатеги, JSON-LD, тексты ошибок |

## Тема

Цвета заданы CSS-переменными в `globals.css` и доступны как Tailwind-утилиты:

| Токен | Значение | Где используется |
|---|---|---|
| `bg` / `surface` | `#FFFFFF` / `#F4F6F9` | фон страницы и секций через одну |
| `ink` / `muted` | `#101828` / `#667085` | основной текст и подписи |
| `brand` | `#1D4ED8` | акценты, иконки, прогресс |
| `cta` | `#F59E0B` | кнопки целевого действия |
| `line` | `#E4E7EC` | границы карточек |

Тёмной темы в проекте нет и не планируется.

## Формы

Обе формы шлют POST на `/api/lead` и различаются полем `source`:

| Источник | `source` | Что уходит |
|---|---|---|
| Квиз | `quiz` | имя, телефон, ответы шагов, вилка расчёта |
| Короткая форма внизу | `final-form` | имя, телефон |

Без `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` заявка пишется в лог сервера
и возвращает успех — демо работает из коробки.

## Аналитика: что вписать, чтобы заработала

1. Завести счётчик на [metrika.yandex.ru](https://metrika.yandex.ru),
   скопировать его номер.
2. Добавить в переменные окружения (локально — `.env.local`,
   на Vercel — Settings → Environment Variables):

   ```
   NEXT_PUBLIC_METRIKA_ID=98765432
   ```

3. В Метрике завести **цели типа «JavaScript-событие»** с идентификаторами:

   | Идентификатор | Когда срабатывает |
   |---|---|
   | `quiz_start` | посетитель начал проходить квиз |
   | `quiz_step_complete` | пройден шаг (в параметрах номер и id шага) |
   | `quiz_submit` | заявка из квиза отправлена |
   | `form_submit` | заявка из короткой формы (в параметрах `source`) |

Цель `quiz_step_complete` показывает, **на каком шаге отваливаются люди** —
это главный аргумент в разговоре с клиентом про доработки.

Без `NEXT_PUBLIC_METRIKA_ID` счётчик не подключается: скрипт не грузится,
запросов нет, сайт работает как обычно.

## Деплой на Vercel

Проект — самостоятельный git-репозиторий (не часть монорепо). Всё нужное
уже в нём, включая `assets/fonts/*.ttf` (для генерации OG-картинки на
сборке) и `public/*.png` (иконки). **Не коммитится:** `.env.local`,
`.next/`, `node_modules/` — они в `.gitignore`.

### Шаги

1. Запушить репозиторий на GitHub.
2. На [vercel.com](https://vercel.com) → **Add New → Project** → выбрать репозиторий.
3. **Root Directory** оставить корнем репозитория (по умолчанию) —
   репозиторий и есть проект.
4. Framework Preset определится как Next.js, команды менять не нужно.
5. В **Environment Variables** добавить (для Production и Preview):

   | Переменная | Значение | Обязательна |
   |---|---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://ваш-домен.ru` | да, иначе canonical и OG будут вести на заглушку |
   | `TELEGRAM_BOT_TOKEN` | токен от @BotFather | для приёма заявок |
   | `TELEGRAM_CHAT_ID` | id чата | для приёма заявок |
   | `NEXT_PUBLIC_METRIKA_ID` | номер счётчика | для аналитики |

6. **Deploy.**
7. Домен: Settings → Domains → добавить свой, обновить `NEXT_PUBLIC_SITE_URL`
   и передеплоить (переменные применяются только при сборке).

### Проверить после первого деплоя

- [ ] Отправить тестовую заявку из квиза и из формы внизу — оба сообщения
      пришли в Telegram, `source` различается
- [ ] Открыть `https://домен/opengraph-image` — картинка отдаётся
- [ ] Кинуть ссылку себе в Telegram — превью подтянулось с картинкой
      и заголовком
- [ ] `https://домен/robots.txt` и `/sitemap.xml` — адреса боевые,
      а не `pervyi-metr.example`
- [ ] `https://домен/privacy` и `/consent` открываются
- [ ] Несуществующий адрес отдаёт осмысленную 404
- [ ] В Метрике появились визиты, цели срабатывают
- [ ] Прогнать [PageSpeed Insights](https://pagespeed.web.dev/) по боевому
      адресу — мобильные метрики должны совпасть с локальными
- [ ] Проверить схемы: [валидатор Яндекса](https://webmaster.yandex.ru/tools/microtest/)
      и [Rich Results Test](https://search.google.com/test/rich-results)

## Качество

Замер на продакшен-сборке, мобильный пресет Lighthouse
(отчёт: `docs/lighthouse-mobile.html`, скриншот: `docs/lighthouse-mobile.png`):

| Категория | Результат |
|---|---|
| Performance | **98** |
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **100** |

LCP 2.2 s · CLS 0 · TBT 70 ms · FCP 1.2 s

## Проверка вёрстки и регрессий

Скриншоты, проверка на горизонтальный скролл и сценарии форм снимались
headless-хромом через `puppeteer-core` с эмуляцией 360 / 768 / 1440.
При правках вёрстки имеет смысл прогонять снова:
`document.documentElement.scrollWidth` не должен превышать
`window.innerWidth`.
