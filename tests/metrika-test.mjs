import puppeteer from "puppeteer-core";

const BASE = "http://localhost:3001";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = (l, c, e = "") => console.log(`${c ? "PASS" : "FAIL"}  ${l}${e ? ` — ${e}` : ""}`);

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--disable-gpu", "--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 390, height: 900, deviceScaleFactor: 1 });

// Не ходим в реальную Метрику, но фиксируем сам факт запроса
await page.setRequestInterception(true);
const metrikaRequests = [];
page.on("request", (r) => {
  if (r.url().includes("mc.yandex.ru")) {
    metrikaRequests.push(r.url());
    r.abort().catch(() => {});
  } else r.continue().catch(() => {});
});

// Подменяем ym ДО загрузки страницы: сниппет Метрики использует
// m[i] = m[i] || function(){...}, поэтому наша заглушка сохранится
await page.evaluateOnNewDocument(() => {
  window.__ymCalls = [];
  window.ym = function (...args) {
    window.__ymCalls.push(args);
  };
});

await page.goto(BASE, { waitUntil: "networkidle0" });
await wait(1200);

/* -------------------- 1. Счётчик подключён и инициализирован -------------- */
const initCall = await page.evaluate(() =>
  window.__ymCalls.find((c) => c[1] === "init"),
);
ok("ym(init) вызван с ID из env", !!initCall && initCall[0] === 99123456,
   JSON.stringify(initCall?.slice(0, 2)));

const tags = await page.evaluate(() => ({
  script: !!document.querySelector("#yandex-metrika"),
  noscript: document.querySelectorAll("noscript").length > 0,
}));
ok("инлайн-скрипт Метрики в DOM", tags.script);
ok("noscript-пиксель на месте", tags.noscript);
ok("запрос к mc.yandex.ru ушёл", metrikaRequests.length > 0,
   metrikaRequests[0]?.slice(0, 60) ?? "нет");

/* ---------------------------- 2. Цель quiz_submit ------------------------- */
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
  { timeout: 12000 },
);
await wait(400);

const goals = await page.evaluate(() =>
  window.__ymCalls.filter((c) => c[1] === "reachGoal").map((c) => ({ goal: c[2], params: c[3] })),
);
ok("цель quiz_start долетела", goals.some((g) => g.goal === "quiz_start"));
ok("цель quiz_step_complete долетела", goals.some((g) => g.goal === "quiz_step_complete"),
   JSON.stringify(goals.find((g) => g.goal === "quiz_step_complete")?.params));
ok("цель quiz_submit долетела", goals.some((g) => g.goal === "quiz_submit"));

/* --------------------------- 3. Цель form_submit -------------------------- */
await page.goto(BASE, { waitUntil: "networkidle0" });
await page.evaluate(() => document.querySelector("#zayavka").scrollIntoView());
await page.waitForFunction(() => {
  const el = document.querySelector("#zayavka input[name=name]");
  return el && Object.keys(el).some((k) => k.startsWith("__react"));
}, { timeout: 15000 });

await page.type("#zayavka input[name=name]", "Пётр");
await page.type("#zayavka input[name=phone]", "9031234567");
await page.$eval("#zayavka button[type=submit]", (b) => b.click());
await page.waitForFunction(
  () => document.querySelector("#zayavka h3")?.textContent?.includes("Заявка принята"),
  { timeout: 12000 },
);
await wait(400);

const formGoal = await page.evaluate(() =>
  window.__ymCalls.filter((c) => c[1] === "reachGoal" && c[2] === "form_submit"),
);
ok("цель form_submit долетела", formGoal.length === 1, JSON.stringify(formGoal[0]?.slice(2)));
ok("  с источником final-form", formGoal[0]?.[3]?.source === "final-form",
   formGoal[0]?.[3]?.source);

await browser.close();
