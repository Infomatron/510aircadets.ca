const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE || "playwright-core",
);
const http = require("http"),
  fs = require("fs"),
  path = require("path"),
  assert = require("assert/strict");
const repo = path.resolve(__dirname, "../.."),
  out = __dirname;
const preview = process.env.PREVIEW_ROOT;
if (!preview)
  throw new Error(
    "Set PREVIEW_ROOT to the isolated, fixture-built site directory. See README.md.",
  );
function server(root, port) {
  return new Promise((resolve) => {
    const s = http
      .createServer((q, r) => {
        let p = path.join(root, decodeURIComponent(q.url.split("?")[0]));
        if (fs.existsSync(p) && fs.statSync(p).isDirectory())
          p = path.join(p, "index.html");
        if (!fs.existsSync(p)) {
          r.writeHead(404);
          return r.end("missing");
        }
        const ext = path.extname(p);
        r.setHeader(
          "Content-Type",
          {
            ".html": "text/html",
            ".js": "application/javascript",
            ".css": "text/css",
            ".svg": "image/svg+xml",
            ".png": "image/png",
          }[ext] || "application/octet-stream",
        );
        fs.createReadStream(p).pipe(r);
      })
      .listen(port, () => resolve(s));
  });
}
(async () => {
  const servers = [
    await server(repo + "/510AirCadets/build", 8765),
    await server(path.join(preview, "build"), 8766),
  ];
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    headless: true,
  });
  const results = [];
  try {
    for (const width of [1440, 1100, 997, 996, 768, 480, 390, 320]) {
      const p = await b.newPage({
        viewport: { width, height: 1000 },
        timezoneId: "America/St_Johns",
      });
      await p.clock.install({ time: new Date("2027-01-19T16:00:00Z") });
      await p.goto("http://localhost:8766/calendar?date=2027-01-19");
      await p.waitForSelector('.calendar-day[aria-pressed="true"]');
      await p.waitForTimeout(300);
      assert.match(
        await p.locator("#month-heading").innerText(),
        /January 2027/,
      );
      const day = p.locator('.calendar-day[aria-pressed="true"]');
      const variant = width > 996 ? "all" : "compact";
      assert.equal(
        await day.locator(".event-category:visible").count(),
        width > 996 ? 12 : 2,
      );
      assert.equal(
        await day
          .locator(`.calendar-category-list--${variant} .event-category`)
          .count(),
        width > 996 ? 12 : 2,
      );
      if (width <= 996)
        assert.match(
          await day
            .locator(".calendar-category-list--compact .calendar-more")
            .innerText(),
          /\+10/,
        );
      assert.equal(await p.locator(".calendar-selection article").count(), 12);
      assert.match(
        await p.locator(".calendar-selection").innerText(),
        /Cancelled/,
      );
      assert.match(
        await p.locator(".calendar-selection").innerText(),
        /Updated/,
      );
      const titles = await p
        .locator(".calendar-announcements article h3")
        .allTextContents();
      assert.deepEqual(titles, ["Fictional notice 1", "Fictional notice 0"]);
      const bounds = await p.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
        ann: document
          .querySelector(".calendar-announcements")
          .getBoundingClientRect().bottom,
        cal: document.querySelector(".calendar-panel").getBoundingClientRect()
          .top,
        overflow: [...document.querySelectorAll(".calendar-day")].some(
          (e) => e.scrollWidth > e.clientWidth + 1,
        ),
      }));
      assert(bounds.scroll <= bounds.width, JSON.stringify(bounds));
      assert(!bounds.overflow, "cell overflow " + width);
      assert(bounds.ann <= bounds.cal);
      if ([1440, 768, 390].includes(width)) {
        await p.evaluate(() => window.scrollTo(0, 0));
        await p.waitForTimeout(200);
        await p.screenshot({
          path: `${out}/fictional-${width}.png`,
          fullPage: true,
        });
      }
      await day.focus();
      await p.keyboard.press("ArrowRight");
      await p.waitForTimeout(150);
      assert.match(
        await p.locator(":focus").getAttribute("aria-label"),
        /January 20/,
      );
      await p.keyboard.press("Enter");
      await p.waitForTimeout(150);
      assert.match(
        await p.locator("#selected-events").innerText(),
        /January 20/,
      );
      assert.equal(await p.locator(".calendar-selection article").count(), 0);
      await p.keyboard.press("PageDown");
      await p.waitForTimeout(150);
      assert.match(
        await p.locator("#month-heading").innerText(),
        /February 2027/,
      );
      await p.keyboard.press("Shift+PageDown");
      await p.waitForTimeout(150);
      assert.match(
        await p.locator("#month-heading").innerText(),
        /February 2028/,
      );
      results.push({
        width,
        fixtureEvents: 12,
        visibleLabels: width > 996 ? 12 : 2,
        more: width > 996 ? 0 : 10,
        overflow: false,
        keyboard: true,
      });
      await p.close();
    }
    for (const width of [1440, 768, 390]) {
      const p = await b.newPage({
        viewport: { width, height: 1000 },
        timezoneId: "America/St_Johns",
      });
      await p.clock.install({ time: new Date("2026-11-02T16:00:00Z") });
      await p.goto("http://localhost:8765/calendar?date=2026-11-02");
      await p.waitForSelector('.calendar-day[aria-pressed="true"]');
      await p.waitForTimeout(300);
      assert.equal(await p.locator(".calendar-selection article").count(), 1);
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.waitForTimeout(200);
      await p.screenshot({
        path: `${out}/production-content-${width}.png`,
        fullPage: true,
      });
      await p.close();
    }
    const ep = await b.newPage({ timezoneId: "America/St_Johns" });
    await ep.clock.install({ time: new Date("2027-01-19T16:00:00Z") });
    await ep.goto("http://localhost:8766/calendar");
    await ep.waitForTimeout(300);
    assert.equal(
      await ep.locator(".calendar-announcements article").count(),
      2,
    );
    await ep.clock.setSystemTime(new Date("2027-01-20T16:00:00Z"));
    await ep.evaluate(() =>
      document.dispatchEvent(new Event("visibilitychange")),
    );
    await ep.waitForTimeout(200);
    assert.deepEqual(
      await ep.locator(".calendar-announcements article h3").allTextContents(),
      ["Fictional notice 2"],
    );
    await ep.goto("http://localhost:8766/calendar/archive");
    await ep.waitForTimeout(200);
    assert.equal(await ep.locator(".update-card").count(), 2);
    await ep.close();
    const nj = await b.newPage({ javaScriptEnabled: false });
    await nj.goto("http://localhost:8765/calendar");
    assert.match(await nj.locator("main").innerText(), /Public event list/);
    assert.equal(await nj.locator("noscript article").count(), 5);
    await nj.close();
    const routeContext = await b.newContext();
    for (const route of [
      "",
      "calendar",
      "calendar/archive",
      "events",
      "announcements",
      "announcements/archive",
      "about",
      "join",
      "activities",
      "parents-cadets",
      "contact",
    ]) {
      const response = await routeContext.request.get(
        "http://localhost:8765/" + route,
      );
      assert.equal(response.status(), 200, route);
    }
    fs.writeFileSync(
      out + "/browser-results.json",
      JSON.stringify(
        {
          browser: "Chromium",
          results,
          productionScreenshots: [1440, 768, 390],
          visibilityRefreshExpiry: true,
          noJavaScriptFallback: true,
          publicRoutes: 11,
        },
        null,
        2,
      ),
    );
    console.log(
      "Browser checks passed: eight widths, crowded dates, status/details, announcement order, keyboard month/year navigation, no overflow; three production screenshots.",
    );
  } finally {
    await b.close();
    servers.forEach((s) => s.close());
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
