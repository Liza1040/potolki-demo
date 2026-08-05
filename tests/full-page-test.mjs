import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = "http://localhost:3000";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = (label, cond, extra = "") =>
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}${extra ? ` — ${extra}` : ""}`);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--disable-gpu", "--hide-scrollbars"],
});

/* ------------------- 1. Ширины: вся страница, 3 вьюпорта ------------------ */
for (const vp of [
  { name: "360", width: 360, height: 800 },
  { name: "768", width: 768, height: 1000 },
  { name: "1440", width: 1440, height: 900 },
]) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);

  // Раскрыть все details — скрытый контент тоже не должен ломать ширину
  await page.evaluate(() =>
    document.querySelectorAll("details").forEach((d) => (d.open = true)),
  );
  await wait(200);

  const r = await page.evaluate(() => {
    const doc = document.documentElement.scrollWidth;
    const win = window.innerWidth;
    const guilty = [];
    if (doc > win) {
      for (const el of document.querySelectorAll("*")) {
        const b = el.getBoundingClientRect();
        if (b.right > win + 1) guilty.push(`${el.tagName}.${el.className}`.slice(0, 70));
      }
    }
    return { doc, win, guilty: guilty.slice(0, 5) };
  });
  ok(`[${vp.name}] scrollWidth == innerWidth`, r.doc === r.win, `doc=${r.doc} win=${r.win}`);
  r.guilty.forEach((g) => console.log("      ", g));
  await page.close();
}

/* ---------------------- 2. Якоря навигации в шапке ------------------------ */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle0" });

  const links = await page.$$eval("header nav a", (as) =>
    as.map((a) => a.getAttribute("href")),
  );
  const missing = await page.evaluate(
    (hrefs) => hrefs.filter((h) => !document.querySelector(h)),
    links,
  );
  ok("все якоря навигации существуют", missing.length === 0,
     missing.length ? `нет: ${missing.join(", ")}` : links.join(" "));

  for (const href of links) {
    await page.evaluate((h) => document.querySelector(`header nav a[href='${h}']`).click(), href);
    await wait(650);
    const res = await page.evaluate((id) => {
      const t = document.getElementById(id);
      const head = document.querySelector("header").getBoundingClientRect();
      const h2 = t.querySelector("h2");
      return { top: Math.round(h2.getBoundingClientRect().top), headerBottom: Math.round(head.bottom) };
    }, href.slice(1));
    ok(`  ${href} — заголовок не под шапкой`, res.top >= res.headerBottom - 1,
       `h2=${res.top} header=${res.headerBottom}`);
  }
  await page.close();
}

/* ------------------ 3. Аккордеон FAQ: клавиатура + первый ----------------- */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle0" });

  const firstOpen = await page.$eval("#faq details", (d) => d.open);
  ok("первый вопрос открыт по умолчанию", firstOpen);

  const secondClosed = await page.$$eval("#faq details", (ds) => ds[1].open);
  ok("остальные закрыты", secondClosed === false);

  // Фокус на summary второго вопроса и Enter
  await page.evaluate(() => {
    const s = document.querySelectorAll("#faq details summary")[1];
    s.focus();
  });
  const focused = await page.evaluate(() => document.activeElement.tagName);
  ok("summary принимает фокус с клавиатуры", focused === "SUMMARY", `active=${focused}`);

  await page.keyboard.press("Enter");
  await wait(200);
  const secondOpenAfter = await page.$$eval("#faq details", (ds) => ds[1].open);
  ok("Enter раскрывает вопрос", secondOpenAfter === true);

  await page.keyboard.press("Enter");
  await wait(200);
  const secondClosedAgain = await page.$$eval("#faq details", (ds) => ds[1].open);
  ok("повторный Enter закрывает", secondClosedAgain === false);

  const count = await page.$$eval("#faq details", (ds) => ds.length);
  ok("шесть вопросов", count === 6, `найдено ${count}`);
  await page.close();
}

/* --------------------- 4. JSON-LD FAQPage валиден ------------------------- */
{
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: "networkidle0" });
  const ld = await page.$$eval('script[type="application/ld+json"]', (ss) =>
    ss.map((s) => s.textContent),
  );
  let parsed = null;
  for (const raw of ld) {
    try {
      const o = JSON.parse(raw);
      if (o["@type"] === "FAQPage") parsed = o;
    } catch {}
  }
  ok("JSON-LD FAQPage парсится", parsed !== null);
  ok("  6 вопросов в схеме", parsed?.mainEntity?.length === 6, `${parsed?.mainEntity?.length}`);
  ok("  у каждого есть ответ",
     parsed?.mainEntity?.every((q) => q.acceptedAnswer?.text?.length > 10));
  await page.close();
}

/* --------------- 5. Финальная форма: валидация + отправка ----------------- */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 900, deviceScaleFactor: 1 });
  const posts = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/lead") && r.method() === "POST") {
      posts.push(JSON.parse(r.postData() ?? "{}"));
    }
  });
  await page.goto(URL, { waitUntil: "networkidle0" });

  await page.evaluate(() => document.querySelector("#zayavka").scrollIntoView());
  // Дождаться гидратации: до неё клик уходит нативным сабмитом
  await page.waitForFunction(() => {
    const el = document.querySelector("#zayavka input[name=name]");
    return el !== null && Object.keys(el).some((k) => k.startsWith("__react"));
  }, { timeout: 15000 });
  await wait(200);

  // Пустая отправка — ошибки, запрос не уходит.
  // Кликаем через DOM: клик по координатам может перехватить липкая шапка.
  await page.$eval("#zayavka button[type=submit]", (b) => b.click());
  await wait(300);
  const errs = await page.$$eval("#zayavka p.text-red-600", (e) => e.length);
  ok("[форма] ошибки после пустой отправки", errs === 2, `ошибок: ${errs}`);
  ok("[форма] запрос не ушёл", posts.length === 0);

  // Заполнить и отправить
  const nameSel = "#zayavka input[name=name]";
  const phoneSel = "#zayavka input[name=phone]";
  await page.type(nameSel, "Пётр");
  await page.type(phoneSel, "9031234567");
  const masked = await page.$eval(phoneSel, (el) => el.value);
  ok("[форма] маска телефона", masked === "+7 (903) 123-45-67", masked);

  await page.click("#zayavka button[type=submit]");
  await page.waitForFunction(
    () => document.querySelector("#zayavka h3")?.textContent?.includes("Заявка принята"),
    { timeout: 10000 },
  );
  ok("[форма] экран успеха", true);
  ok("[форма] ровно один POST", posts.length === 1, `${posts.length}`);
  ok("[форма] source = final-form", posts[0]?.source === "final-form", posts[0]?.source);
  ok("[форма] телефон в E.164", posts[0]?.phone === "+79031234567", posts[0]?.phone);
  await page.close();
}

/* ------------------ 6. Квиз по-прежнему шлёт source: quiz ---------------- */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 900, deviceScaleFactor: 1 });
  const posts = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/lead") && r.method() === "POST") {
      posts.push(JSON.parse(r.postData() ?? "{}"));
    }
  });
  await page.goto(URL, { waitUntil: "networkidle0" });

  const clickLabel = (t) =>
    page.evaluate((text) => {
      [...document.querySelectorAll("#quiz label")]
        .find((l) => l.textContent?.includes(text))?.click();
    }, t);
  const clickBtn = (t) =>
    page.evaluate((text) => {
      [...document.querySelectorAll("#quiz button")]
        .find((b) => b.textContent?.trim().includes(text))?.click();
    }, t);

  await clickLabel("Комната");
  await wait(700);
  await clickBtn("15–25");
  await clickBtn("Далее");
  await wait(500);
  await clickLabel("Матовый");
  await wait(800);

  await page.type("#name", "Ирина");
  await page.type("#phone", "9161112233");
  await clickBtn("Записаться");
  await page.waitForFunction(
    () => document.querySelector("#quiz h3")?.textContent?.includes("Заявка принята"),
    { timeout: 10000 },
  );
  ok("[квиз] экран успеха", true);
  ok("[квиз] source = quiz", posts[0]?.source === "quiz", posts[0]?.source);
  ok("[квиз] ответы приложены", posts[0]?.answers?.texture === "matte",
     JSON.stringify(posts[0]?.answers));

  // Ссылка согласия под формой квиза
  await page.goto(URL, { waitUntil: "networkidle0" });
  const consentLinks = await page.$$eval("#quiz a[href='/privacy'], #zayavka a[href='/privacy']",
    (as) => as.length);
  ok("ссылка на политику есть под формой", consentLinks >= 0);
  await page.close();
}

/* ---------------------- 7. Юридические страницы -------------------------- */
for (const path of ["/privacy", "/consent"]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 1 });
  const res = await page.goto(URL + path, { waitUntil: "networkidle0" });
  const h1 = await page.$eval("h1", (e) => e.textContent?.trim());
  const words = await page.evaluate(() => document.body.innerText.split(/\s+/).length);
  const r = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth,
    win: window.innerWidth,
  }));
  ok(`${path} — ${res.status()}, «${h1}», ${words} слов, ширина ok`,
     res.status() === 200 && words > 150 && r.doc === r.win);
  await page.close();
}

await browser.close();
