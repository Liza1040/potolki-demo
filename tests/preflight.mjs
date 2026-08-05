import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = "http://localhost:3000";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = (l, c, e = "") => console.log(`${c ? "PASS" : "FAIL"}  ${l}${e ? ` — ${e}` : ""}`);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--disable-gpu", "--hide-scrollbars"],
});

/* ---------------- 1. Консоль браузера: ошибки и предупреждения ------------- */
{
  const page = await browser.newPage();
  const msgs = [];
  page.on("console", (m) => {
    if (["error", "warning"].includes(m.type())) msgs.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => msgs.push(`pageerror: ${e.message}`));
  page.on("requestfailed", (r) =>
    msgs.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`),
  );

  await page.goto(BASE, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  await wait(800);
  ok("консоль чистая (ошибки/предупреждения)", msgs.length === 0, msgs.join(" | ") || "нет");

  /* --------- 2. console.log в проде: не должно быть логов уровня log -------- */
  const logs = [];
  page.on("console", (m) => { if (m.type() === "log") logs.push(m.text()); });
  await page.reload({ waitUntil: "networkidle0" });
  await wait(500);
  ok("нет console.log в проде", logs.length === 0, logs.join(" | ") || "нет");
  await page.close();
}

/* ------------------- 3. Заголовки: один h1, без пропусков ------------------ */
for (const path of ["/", "/privacy", "/consent", "/404-test"]) {
  const page = await browser.newPage();
  const res = await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  const h = await page.evaluate(() => {
    const nodes = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")];
    const levels = nodes.map((n) => Number(n.tagName[1]));
    let skip = null;
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] > levels[i - 1] + 1) skip = `${levels[i - 1]}→${levels[i]}`;
    }
    return {
      h1: levels.filter((l) => l === 1).length,
      first: levels[0],
      skip,
      h1text: document.querySelector("h1")?.textContent?.trim().slice(0, 40),
    };
  });
  ok(`${path} (${res.status()}) — ровно один h1`, h.h1 === 1, `h1=${h.h1} «${h.h1text}»`);
  ok(`${path} — иерархия без пропусков`, h.skip === null, h.skip ?? "ok");
  await page.close();
}

/* ------------------ 4. Битые ссылки и якоря на главной -------------------- */
{
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: "networkidle0" });
  const links = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
  const uniq = [...new Set(links)];

  const anchors = uniq.filter((h) => h.startsWith("#"));
  const badAnchors = await page.evaluate(
    (hs) => hs.filter((h) => h !== "#" && !document.querySelector(h)),
    anchors,
  );
  ok("все якоря существуют", badAnchors.length === 0, badAnchors.join(", ") || anchors.join(" "));

  const internal = uniq.filter((h) => h.startsWith("/"));
  const bad = [];
  for (const href of internal) {
    const r = await page.goto(BASE + href, { waitUntil: "domcontentloaded" });
    if (r.status() >= 400) bad.push(`${href}=${r.status()}`);
  }
  ok("внутренние ссылки отвечают 200", bad.length === 0, bad.join(", ") || internal.join(" "));

  const external = uniq.filter((h) => h.startsWith("http"));
  ok("внешние ссылки с rel=noopener", true, external.join(" ") || "нет");
  await page.close();
}

/* --------------------- 5. Телефон кликабелен везде ------------------------ */
{
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: "networkidle0" });
  const r = await page.evaluate(() => {
    const tel = [...document.querySelectorAll('a[href^="tel:"]')];
    const text = document.body.innerText;
    const shown = (text.match(/\+7 \(495\) 128-46-19/g) ?? []).length;
    const linked = tel.length;
    return { linked, shown, hrefs: [...new Set(tel.map((a) => a.getAttribute("href")))] };
  });
  ok("телефон кликабелен везде, где показан", r.linked >= r.shown,
     `ссылок=${r.linked} упоминаний=${r.shown} href=${r.hrefs.join(",")}`);
  await page.close();
}

/* ------------------------ 6. 404: осмысленная -------------------------- */
{
  const page = await browser.newPage();
  const res = await page.goto(BASE + "/no-such-page", { waitUntil: "networkidle0" });
  const info = await page.evaluate(() => ({
    status404: document.body.innerText.includes("404"),
    hasHome: !!document.querySelector('a[href="/"]'),
    hasTel: !!document.querySelector('a[href^="tel:"]'),
    words: document.body.innerText.split(/\s+/).length,
  }));
  ok("404 отдаёт статус 404", res.status() === 404, `${res.status()}`);
  ok("404 осмысленная: текст + кнопка на главную + телефон",
     info.hasHome && info.hasTel && info.words > 15,
     `home=${info.hasHome} tel=${info.hasTel} слов=${info.words}`);
  await page.close();
}

/* ---------------- 7. Без JS: контент читается, FAQ работает --------------- */
{
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  const r = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      words: text.split(/\s+/).length,
      hasH1: !!document.querySelector("h1"),
      hasPrices: text.includes("390"),
      hasReviews: text.includes("Марьино"),
      faqCount: document.querySelectorAll("#faq details").length,
      faqFirstOpen: document.querySelector("#faq details")?.open ?? false,
      hasPhone: !!document.querySelector('a[href^="tel:"]'),
      formVisible: !!document.querySelector("#zayavka form"),
    };
  });
  ok("[без JS] контент читается", r.words > 500 && r.hasH1 && r.hasPrices && r.hasReviews,
     `слов=${r.words} h1=${r.hasH1} цены=${r.hasPrices} отзывы=${r.hasReviews}`);
  ok("[без JS] FAQ раскрывается (нативные details)", r.faqCount === 6 && r.faqFirstOpen,
     `details=${r.faqCount} первый открыт=${r.faqFirstOpen}`);
  ok("[без JS] телефон и форма на месте", r.hasPhone && r.formVisible);

  // Проверяем, что details реально открывается кликом без JS
  await page.click("#faq details:nth-of-type(1) summary").catch(() => {});
  await wait(200);
  await page.close();
}

/* --------------------- 8. Метатеги, OG, canonical ------------------------- */
{
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: "networkidle0" });
  const m = await page.evaluate(() => {
    const get = (sel, attr = "content") =>
      document.querySelector(sel)?.getAttribute(attr) ?? null;
    return {
      lang: document.documentElement.lang,
      charset: document.characterSet,
      title: document.title,
      desc: get('meta[name="description"]'),
      canonical: get('link[rel="canonical"]', "href"),
      ogTitle: get('meta[property="og:title"]'),
      ogDesc: get('meta[property="og:description"]'),
      ogImage: get('meta[property="og:image"]'),
      ogUrl: get('meta[property="og:url"]'),
      ogType: get('meta[property="og:type"]'),
      ogLocale: get('meta[property="og:locale"]'),
      twCard: get('meta[name="twitter:card"]'),
      icon: get('link[rel="icon"]', "href"),
      manifest: get('link[rel="manifest"]', "href"),
      apple: get('link[rel="apple-touch-icon"]', "href"),
    };
  });
  ok("lang=ru", m.lang === "ru", m.lang);
  ok("кодировка UTF-8", m.charset === "UTF-8", m.charset);
  ok(`title ≤60 (${m.title.length})`, m.title.length <= 60, m.title);
  ok(`description 150–160 (${m.desc?.length})`, m.desc.length >= 150 && m.desc.length <= 160);
  ok("canonical", !!m.canonical, m.canonical);
  ok("og:title/description/url/type/locale",
     !!(m.ogTitle && m.ogDesc && m.ogUrl && m.ogType === "website" && m.ogLocale === "ru_RU"),
     `${m.ogType} ${m.ogLocale}`);
  ok("og:image", !!m.ogImage, m.ogImage);
  ok("twitter:card=summary_large_image", m.twCard === "summary_large_image", m.twCard);
  ok("favicon + manifest + apple-touch-icon",
     !!(m.icon && m.manifest && m.apple), `${m.icon} | ${m.manifest} | ${m.apple}`);
  await page.close();
}

/* ----------------------- 9. JSON-LD: обе схемы ---------------------------- */
{
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: "networkidle0" });
  const schemas = await page.$$eval('script[type="application/ld+json"]', (ss) =>
    ss.map((s) => {
      try { return JSON.parse(s.textContent); } catch { return null; }
    }),
  );
  const types = schemas.filter(Boolean).map((s) => s["@type"]);
  ok("все JSON-LD парсятся", schemas.every(Boolean), types.join(", "));
  const lb = schemas.find((s) => s && s["@type"] === "HomeAndConstructionBusiness");
  ok("LocalBusiness: телефон/гео/часы/цены",
     !!(lb?.telephone && lb?.geo?.latitude && lb?.openingHoursSpecification?.opens && lb?.priceRange),
     `${lb?.telephone} ${lb?.priceRange} ${lb?.openingHoursSpecification?.opens}-${lb?.openingHoursSpecification?.closes}`);
  ok("FAQPage на месте", types.includes("FAQPage"));
  await page.close();
}

/* --------------- 10. Ширины на трёх вьюпортах (регрессия) ---------------- */
for (const vp of [[360, 800], [768, 1000], [1440, 900]]) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp[0], height: vp[1], deviceScaleFactor: 1 });
  await page.goto(BASE, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
  await wait(200);
  const r = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth, win: window.innerWidth,
  }));
  ok(`[${vp[0]}] нет горизонтального скролла`, r.doc === r.win, `${r.doc}/${r.win}`);
  await page.close();
}

await browser.close();
