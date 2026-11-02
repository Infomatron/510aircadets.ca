// Optional review checks: no production dependency. See README.md for environment paths.
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE || "playwright-core",
);
const fs = require("node:fs"),
  http = require("node:http"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const root = path.resolve(__dirname, "../.."),
  out = __dirname;
const before = process.env.BEFORE_BUILD,
  fixture = process.env.FIXTURE_BUILD;
if (!before || !fixture)
  throw Error(
    "Set BEFORE_BUILD and FIXTURE_BUILD to isolated build directories.",
  );
function serve(root, port) {
  return new Promise((resolve) => {
    const s = http
      .createServer((req, res) => {
        let p = path.join(root, decodeURIComponent(req.url.split("?")[0]));
        if (fs.existsSync(p) && fs.statSync(p).isDirectory())
          p = path.join(p, "index.html");
        if (!fs.existsSync(p)) {
          res.writeHead(404);
          return res.end("Not found");
        }
        res.setHeader(
          "Content-Type",
          {
            ".html": "text/html",
            ".js": "application/javascript",
            ".css": "text/css",
            ".svg": "image/svg+xml",
          }[path.extname(p)] || "application/octet-stream",
        );
        fs.createReadStream(p).pipe(res);
      })
      .listen(port, () => resolve(s));
  });
}
(async () => {
  const servers = [
    await serve(before, 8780),
    await serve(path.join(root, "510AirCadets/build"), 8781),
    await serve(fixture, 8782),
  ];
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
    headless: true,
  });
  const results = [];
  try {
    for (const width of [1440, 1100, 997, 996, 768, 480, 390, 320]) {
      const p = await b.newPage({
        viewport: { width, height: 1000 },
        timezoneId: "America/St_Johns",
      });
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      await p.clock.install({ time: new Date("2026-11-02T16:00:00Z") });
      if ([1440, 768, 390].includes(width)) {
        await p.goto("http://localhost:8780/calendar?date=2026-11-02");
        await p.waitForTimeout(400);
        assert(
          await p
            .locator(".category-key")
            .evaluate(
              (e) =>
                !!(
                  e.compareDocumentPosition(
                    document.querySelector(".month-calendar"),
                  ) & Node.DOCUMENT_POSITION_FOLLOWING
                ),
            ),
        );
        await p.screenshot({
          path: path.join(out, `before-${width}.png`),
          fullPage: true,
        });
      }
      await p.goto("http://localhost:8781/calendar?date=2026-11-02");
      await p.waitForTimeout(400);
      const layout = await p.evaluate(() => {
        const r = (s) => document.querySelector(s).getBoundingClientRect();
        const table = r(".month-calendar"),
          help = r("#calendar-help"),
          detail = r(".calendar-selection"),
          key = r(".category-key"),
          ann = r(".calendar-announcements");
        const selected = document.querySelector(
            '.calendar-day[aria-pressed="true"]',
          ),
          number = selected.querySelector(".calendar-number"),
          sr = selected.getBoundingClientRect(),
          nr = number.getBoundingClientRect();
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          order:
            ann.bottom <= table.top &&
            table.bottom <= help.top &&
            help.bottom <= detail.top &&
            detail.bottom <= key.top,
          keyCount: document.querySelectorAll(".category-key").length,
          leftInset: nr.left - sr.left,
          numberBelowLabels:
            nr.bottom >
            selected
              .querySelector(".calendar-category-list--compact")
              .getBoundingClientRect().top,
          controls: [
            ...document.querySelectorAll(".calendar-selectors select"),
          ].map((e) => {
            const c = getComputedStyle(e);
            return {
              height: e.getBoundingClientRect().height,
              paddingRight: parseFloat(c.paddingRight),
              arrow: c.backgroundPosition,
              appearance: c.appearance,
            };
          }),
        };
      });
      assert(!layout.overflow, JSON.stringify({ width, layout }));
      assert(layout.order);
      assert.equal(layout.keyCount, 1);
      assert(layout.leftInset >= 4 && layout.leftInset <= 6);
      assert(
        layout.controls.every(
          (c) =>
            c.height >= 44 && c.paddingRight >= 35 && c.appearance === "none",
        ),
      );
      const today = p.getByRole("button", { name: "Today", exact: true });
      assert.equal(
        await today.evaluate((e) => getComputedStyle(e).backgroundColor),
        "rgb(249, 189, 17)",
      );
      assert.equal(
        await today.evaluate((e) => getComputedStyle(e).color),
        "rgb(33, 72, 103)",
      );
      await today.hover();
      assert.equal(
        await today.evaluate((e) => getComputedStyle(e).backgroundColor),
        "rgb(255, 208, 82)",
      );
      await p.mouse.down();
      assert.equal(
        await today.evaluate((e) => getComputedStyle(e).backgroundColor),
        "rgb(239, 179, 14)",
      );
      await p.mouse.up();
      await today.focus();
      await p.keyboard.press("Shift+Tab");
      await p.keyboard.press("Tab");
      assert.equal(
        await today.evaluate((e) => getComputedStyle(e).outlineStyle),
        "solid",
      );
      await today.evaluate((e) => (e.disabled = true));
      assert.equal(
        await today.evaluate((e) => getComputedStyle(e).cursor),
        "not-allowed",
      );
      await today.evaluate((e) => (e.disabled = false));
      await p.getByLabel("Month", { exact: true }).selectOption("1");
      await p.getByLabel("Year", { exact: true }).selectOption("2028");
      await p.waitForTimeout(100);
      assert.match(
        await p.locator("#month-heading").innerText(),
        /February 2028/,
      );
      assert.equal(await p.locator(".calendar-number").count(), 29);
      await today.click();
      await p.waitForTimeout(100);
      assert.match(
        await p.locator("#month-heading").innerText(),
        /November 2026/,
      );
      let selected = p.locator('.calendar-day[aria-pressed="true"]');
      await selected.focus();
      await p.keyboard.press("ArrowRight");
      await p.waitForTimeout(100);
      assert.match(
        await p.locator(":focus").getAttribute("aria-label"),
        /November 3/,
      );
      assert.notEqual(
        await p
          .locator(":focus")
          .evaluate((e) => getComputedStyle(e).outlineStyle),
        "none",
      );
      await p.keyboard.press("Enter");
      await p.waitForTimeout(100);
      assert.match(
        await p.locator("#selected-events").innerText(),
        /November 3/,
      );
      assert.match(
        await p.locator(".calendar-selection").innerText(),
        /Regular Training/,
      );
      await p.getByRole("button", { name: "Next month" }).click();
      await p.waitForTimeout(100);
      assert.match(
        await p.locator("#month-heading").innerText(),
        /December 2026/,
      );
      await p.getByRole("button", { name: "Previous month" }).click();
      await today.click();
      await p.waitForTimeout(100);
      await p.getByText("Event category key", { exact: true }).click();
      assert.equal(await p.locator(".category-legend li").count(), 10);
      assert(await p.locator(".category-key").evaluate((e) => e.open));
      await p.getByText("Event category key", { exact: true }).click();
      if ([1440, 768, 390].includes(width)) {
        await p.mouse.move(0, 0);
        await p.evaluate(() => {
          document.activeElement.blur();
          window.scrollTo(0, 0);
        });
        await p.screenshot({
          path: path.join(out, `after-${width}.png`),
          fullPage: true,
        });
      }
      await p.emulateMedia({ forcedColors: "active" });
      assert.equal(
        await p
          .getByLabel("Month", { exact: true })
          .evaluate((e) => getComputedStyle(e).appearance),
        "auto",
      );
      await p.emulateMedia({ forcedColors: "none" });
      await p.goto("http://localhost:8782/calendar?date=2027-01-19");
      await p.waitForTimeout(400);
      assert.equal(await p.locator(".calendar-selection article").count(), 12);
      const cell = p.locator('.calendar-day[aria-pressed="true"]');
      assert.equal(
        await cell.locator(".event-category:visible").count(),
        width > 996 ? 12 : 2,
      );
      if (width <= 996)
        assert.match(
          await cell.locator(".calendar-more:visible").innerText(),
          /\+10/,
        );
      const badges = await cell
        .locator(".event-category:visible")
        .evaluateAll((es) =>
          es.map((e) => {
            const i = e.querySelector("svg"),
              t = e.querySelector(".category-full-label"),
              r = e.getBoundingClientRect(),
              ir = i.getBoundingClientRect(),
              tr = t.getBoundingClientRect();
            return {
              align: getComputedStyle(e).alignItems,
              iconVisible: getComputedStyle(i).display !== "none",
              centreDelta: Math.abs(
                ir.top + ir.height / 2 - tr.top - tr.height / 2,
              ),
              overflow: e.scrollWidth > e.clientWidth + 1,
            };
          }),
        );
      assert(badges.every((x) => x.align === "center" && !x.overflow));
      assert(
        badges.filter((x) => x.iconVisible).every((x) => x.centreDelta <= 1),
        JSON.stringify(badges),
      );
      assert.equal(errors.length, 0, errors.join("\n"));
      if ([1440, 768, 390].includes(width)) {
        await p.evaluate(() => window.scrollTo(0, 0));
        await p.screenshot({
          path: path.join(out, `fictional-labels-${width}.png`),
          fullPage: true,
        });
      }
      results.push({
        width,
        layout,
        visibleEventLabels: badges.length,
        iconsVerticallyCentred: true,
        navigationAndSelection: true,
        todayStatesAndFocus: true,
        forcedColorsNativeSelect: true,
        consoleErrors: errors,
      });
      await p.close();
    }
    fs.writeFileSync(
      path.join(out, "browser-results.json"),
      JSON.stringify({ browser: await b.version(), results }, null, 2) + "\n",
    );
    console.log(
      "PASS: eight widths; ordering, native selectors, Today states/focus, left day numbers, all-category alignment, date/month/year navigation and overflow.",
    );
  } finally {
    await b.close();
    servers.forEach((s) => s.close());
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
