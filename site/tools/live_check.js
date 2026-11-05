const { chromium, devices } = require("playwright");
(async () => {
  const b = await chromium.launch();
  for (const [name, opt] of [["desktop", { viewport: { width: 1366, height: 860 } }], ["phone", devices["Pixel 7"]]]) {
    const p = await (await b.newContext(opt)).newPage(); const errs = [];
    p.on("pageerror", e => errs.push(e.message));
    await p.goto("https://pressurecookerpoetry.com/#/kitchen", { waitUntil: "networkidle" });
    await p.waitForTimeout(800);
    await p.screenshot({ path: "/root/tasks/pcp-site-update/shots/98-live-" + name + ".png" });
    console.log(name, "tiles", await p.locator(".tile, [data-ing]").count(), "errors", errs.length ? errs : "none");
  }
  await b.close();
})();
