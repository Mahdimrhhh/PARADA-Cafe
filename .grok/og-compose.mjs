import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const fontSerif = readFileSync(
  "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
).toString("base64");
const fontSans = readFileSync(
  "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
).toString("base64");
const bg = readFileSync("/workspace/.grok/og-bg.jpg").toString("base64");

const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<style>
@font-face {
  font-family: "ParadaSerif";
  src: url("data:font/truetype;base64,${fontSerif}") format("truetype");
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: "ParadaSans";
  src: url("data:font/truetype;base64,${fontSans}") format("truetype");
  font-weight: 400;
  font-style: normal;
}
html, body {
  margin: 0;
  width: 1200px;
  height: 630px;
  overflow: hidden;
  background: #2A2724;
}
.scene {
  position: absolute;
  inset: 0;
  background: url("data:image/jpeg;base64,${bg}") center / cover no-repeat;
}
.scrim {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 78% 68% at 48% 50%,
      rgba(42, 39, 36, 0.12) 0%,
      rgba(42, 39, 36, 0.38) 58%,
      rgba(42, 39, 36, 0.62) 100%),
    linear-gradient(90deg,
      rgba(42, 39, 36, 0.18) 0%,
      transparent 22%,
      transparent 72%,
      rgba(42, 39, 36, 0.50) 100%);
}
.warm {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(196, 146, 58, 0.10) 0%, transparent 28%, transparent 70%, rgba(42, 39, 36, 0.28) 100%);
  pointer-events: none;
}
.lockup {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.wordmark {
  font-family: "ParadaSerif", "Times New Roman", serif;
  font-weight: 400;
  font-size: 100px;
  letter-spacing: 0.54em;
  padding-left: 0.54em;
  color: #F7F3EA;
  line-height: 1;
  margin: 0;
  text-shadow:
    0 1px 0 rgba(42, 39, 36, 0.35),
    0 8px 28px rgba(42, 39, 36, 0.55),
    0 0 42px rgba(42, 39, 36, 0.40);
}
.led {
  width: 168px;
  height: 3px;
  margin-top: 30px;
  border-radius: 2px;
  background: #C4923A;
  box-shadow:
    0 0 10px 2px rgba(196, 146, 58, 0.95),
    0 0 28px 8px rgba(196, 146, 58, 0.45),
    0 0 48px 14px rgba(196, 146, 58, 0.22);
}
.tag {
  font-family: "ParadaSans", sans-serif;
  font-size: 17px;
  letter-spacing: 0.38em;
  padding-left: 0.38em;
  color: #EBE6DC;
  margin: 22px 0 0 0;
  opacity: 0.92;
  text-shadow: 0 2px 12px rgba(42, 39, 36, 0.7);
  font-weight: 400;
}
.tag .ar {
  letter-spacing: 0.08em;
  padding-left: 0;
  font-size: 16px;
}
</style>
<body>
  <div class="scene"></div>
  <div class="scrim"></div>
  <div class="warm"></div>
  <div class="lockup">
    <p class="wordmark">PARADA</p>
    <div class="led"></div>
    <p class="tag">specialty coffee&nbsp;&nbsp;·&nbsp;&nbsp;<span class="ar" lang="fa" dir="rtl">توقفگاه</span></p>
  </div>
</body>
</html>`;

writeFileSync("/workspace/.grok/og-card.html", html);

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2,
  });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.waitForTimeout(200);
  await page.screenshot({
    path: "/workspace/.grok/og-raw.png",
    type: "png",
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  console.log("screenshot ok");
} finally {
  await browser.close();
}
