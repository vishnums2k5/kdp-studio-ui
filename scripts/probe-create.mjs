#!/usr/bin/env node
/** One-off interaction probes: opens the kids-story create modal, fills it,
 * creates a book, and verifies the studio route receives pages. */
import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const out = [];
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

await page.goto("http://localhost:3100/create/kids-story", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Create New Book" }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: "docs/verification/captures/create-kids-story-modal-1440w.png" });

await page.getByLabel("Book Title").fill("Momo the Mountain Cat");
await page.getByLabel(/Story Description/).fill("A shy cat learns to climb high peaks with a friend.");
await page.getByLabel(/Number of Pages/).fill("12");
await page.getByRole("button", { name: "Generate Kids Book" }).click();

// Should navigate to the studio and stream pages
await page.waitForURL(/\/studio\/book-/, { timeout: 15000 });
out.push(`navigated: ${page.url()}`);
await page.waitForTimeout(1500);
out.push(`heading: ${await page.locator("h1, [class*=title]").first().textContent().catch(() => "n/a")}`);
await page.screenshot({ path: "docs/verification/captures/create-kids-story-generating-1440w.png" });

console.log(out.join("\n"));
console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "console clean");
await browser.close();
