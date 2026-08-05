import { readFileSync, writeFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

const PROJ = "C:/workRepos/frilance/projects/potolki-demo";
const svg = readFileSync(`${PROJ}/app/icon.svg`, "utf8");

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--disable-gpu", "--force-device-scale-factor=1"],
});

async function render(size, outPath) {
  const page = await browser.newPage();
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  await page.setContent(
    `<html><body style="margin:0;padding:0;background:transparent">
       <div style="width:${size}px;height:${size}px">${svg.replace(
         /width="64" height="64"/,
         `width="${size}" height="${size}"`,
       )}</div>
     </body></html>`,
    { waitUntil: "load" },
  );
  const buf = await page.screenshot({ omitBackground: true, type: "png" });
  writeFileSync(outPath, buf);
  await page.close();
  return buf;
}

// Apple touch icon: без прозрачности, iOS всё равно подставит чёрный фон
const applePage = await browser.newPage();
await applePage.setViewport({ width: 180, height: 180, deviceScaleFactor: 1 });
await applePage.setContent(
  `<html><body style="margin:0;background:#1D4ED8">
     <div style="width:180px;height:180px;display:flex;align-items:center;justify-content:center">
       ${svg.replace(/width="64" height="64"/, 'width="150" height="150"')}
     </div>
   </body></html>`,
  { waitUntil: "load" },
);
writeFileSync(`${PROJ}/app/apple-icon.png`, await applePage.screenshot({ type: "png" }));
await applePage.close();

const png32 = await render(32, `${PROJ}/public/icon-32.png`);
await render(192, `${PROJ}/public/icon-192.png`);
await render(512, `${PROJ}/public/icon-512.png`);

/**
 * .ico — контейнер: 6-байтный ICONDIR + 16-байтная запись + payload.
 * Начиная с Vista внутрь можно класть PNG как есть, что мы и делаем.
 */
function pngToIco(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(1, 4); // количество изображений

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0); // ширина (0 = 256)
  entry.writeUInt8(size === 256 ? 0 : size, 1); // высота
  entry.writeUInt8(0, 2); // палитра не используется
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // цветовые плоскости
  entry.writeUInt16LE(32, 6); // бит на пиксель
  entry.writeUInt32LE(png.length, 8); // размер данных
  entry.writeUInt32LE(header.length + entry.length, 12); // смещение данных

  return Buffer.concat([header, entry, png]);
}

writeFileSync(`${PROJ}/app/favicon.ico`, pngToIco(png32, 32));

await browser.close();
console.log("icons: favicon.ico(32), apple-icon.png(180), icon-32/192/512.png");
