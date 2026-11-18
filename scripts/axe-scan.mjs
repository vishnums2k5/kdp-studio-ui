#!/usr/bin/env node
/** Axe scan of key routes — output violations summary to docs/verification/axe-summary.json */
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync } from "node:fs";

const ROUTES = [
  "/dashboard",
  "/books",
  "/images",
  "/library",
  "/create",
  "/create/kids-story",
  "/studio/woodland-activity-sampler",
  "/studio/pip-the-brave-little-hedgehog/cover",
  "/research",
  "/account",
  "/account/billing",
  "/dev/components",
];

const browser = await chromium.launch();
const results = [];
for (const route of ROUTES) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3100" + route, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(500);
  const res = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const violations = res.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.length,
    firstTarget: v.nodes[0]?.target?.[0]?.slice(0, 80) ?? "",
    summary: v.help,
  }));
  results.push({ route, violations });
  console.log(`${route}: ${violations.length} violation kinds`);
  await context.close();
}
await browser.close();
writeFileSync("docs/verification/axe-summary.json", JSON.stringify(results, null, 2));
const total = results.reduce((n, r) => n + r.violations.length, 0);
console.log(`\nTotal violation kinds: ${total} — details in docs/verification/axe-summary.json`);
