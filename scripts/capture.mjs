#!/usr/bin/env node
/**
 * Capture tool for the per-screen verification gates (rebuild prompt §6D).
 * Usage:
 *   node scripts/capture.mjs [--base http://localhost:3100] [--out docs/verification/captures]
 *        [--widths 1440,1280,1024,768,390] [--routes /a,/b] [--full]
 * Routes default to the full route matrix. Console errors fail the capture.
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { parseArgs } from "node:util";

const ROUTES = [
  "/dashboard",
  "/books",
  "/images",
  "/library",
  "/create",
  "/create/kids-story",
  "/create/non-fiction",
  "/create/coloring",
  "/create/word-search",
  "/create/trivia",
  "/create/sudoku",
  "/create/math",
  "/create/journal",
  "/create/blank",
  "/studio/woodland-activity-sampler",
  "/studio/woodland-activity-sampler/cover",
  "/research",
  "/research/report/farm-animals-coloring-book",
  "/account",
  "/account/billing",
  "/account/credits",
  "/dev/components",
  "/does-not-exist",
];

const args = parseArgs({
  options: {
    base: { type: "string", default: "http://localhost:3100" },
    out: { type: "string", default: "docs/verification/captures" },
    widths: { type: "string", default: "1440" },
    routes: { type: "string", default: "" },
    full: { type: "boolean", default: false },
  },
}).values;

const routes = args.routes
  ? args.routes.split(",").filter(Boolean)
  : ROUTES;
const widths = args.widths.split(",").map(Number);
mkdirSync(args.out, { recursive: true });

const browser = await chromium.launch();
const failures = [];

for (const width of widths) {
  const ctx = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(String(err)));

  for (const route of routes) {
    const slug = route === "/" ? "root" : route.replace(/^\//, "").replace(/[/?]+/g, "-") || "root";
    const name = `${slug}-${width}w`;
    try {
      const resp = await page.goto(args.base + route, { waitUntil: "networkidle", timeout: 30000 });
      if (!resp || resp.status() >= 500) throw new Error(`HTTP ${resp?.status()}`);
      await page.waitForTimeout(400);
      await page.screenshot({
        path: `${args.out}/${name}.png`,
        fullPage: args.full,
      });
      const status = consoleErrors.length === 0 ? "ok" : "console-errors";
      console.log(`${status} ${name}`);
      if (consoleErrors.length) {
        failures.push({ route, width, consoleErrors: [...consoleErrors] });
        consoleErrors.length = 0;
      }
    } catch (err) {
      console.log(`FAIL ${name}: ${err.message}`);
      failures.push({ route, width, error: err.message });
    }
  }
  await ctx.close();
}

await browser.close();
if (failures.length) {
  console.log("\nFAILURES:");
  for (const f of failures) console.log(JSON.stringify(f));
  process.exitCode = 1;
} else {
  console.log("\nAll captures clean (no console errors).");
}
