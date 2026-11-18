/**
 * Original SVG "art" generator for mock scenes, covers and library assets.
 * Everything is drawn programmatically (no copied imagery) — abstract,
 * shape-based illustrations in the book's palette.
 */

type Rng = () => number;

function mulberry(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTES = [
  ["#5646D6", "#8C83F0", "#D6DEF9", "#37304A"],
  ["#0E7C66", "#5FBFA4", "#D7EFE7", "#0B3B31"],
  ["#D63F8A", "#F08DBB", "#FBE1EC", "#5C2440"],
  ["#BF6A00", "#E8A24C", "#FBE9D2", "#5C3A0B"],
  ["#2563AE", "#6FA3DE", "#DBE9F7", "#1B3A5C"],
  ["#7C3AED", "#B49CF5", "#EDE6FC", "#372160"],
];

const palette = (seed: number): string[] =>
  PALETTES[Math.abs(seed) % PALETTES.length] ?? PALETTES[0]!;

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s{2,}/g, " "))}`;
}

/** Abstract scene art — rounded shapes composition. */
export function sceneArt(seed: number, lineArt = false): string {
  const rng = mulberry(seed);
  const pal = palette(seed);
  const shapes: string[] = [];
  const n = 5 + Math.floor(rng() * 4);
  for (let i = 0; i < n; i++) {
    const x = 20 + rng() * 260;
    const y = 20 + rng() * 260;
    const r = 12 + rng() * 46;
    const c = pal[Math.floor(rng() * pal.length)];
    const kind = rng();
    if (kind < 0.4) {
      shapes.push(
        lineArt
          ? `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(0)}" fill="none" stroke="#1C1E26" stroke-width="1.6"/>`
          : `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(0)}" fill="${c}" opacity="0.85"/>`,
      );
    } else if (kind < 0.75) {
      const w = r * (1 + rng());
      const h = r * (0.5 + rng());
      shapes.push(
        lineArt
          ? `<rect x="${(x - w / 2).toFixed(0)}" y="${(y - h / 2).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" rx="${(r / 4).toFixed(0)}" fill="none" stroke="#1C1E26" stroke-width="1.6"/>`
          : `<rect x="${(x - w / 2).toFixed(0)}" y="${(y - h / 2).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" rx="${(r / 4).toFixed(0)}" fill="${c}" opacity="0.85"/>`,
      );
    } else {
      const x2 = 20 + rng() * 260;
      const y2 = 20 + rng() * 260;
      shapes.push(
        lineArt
          ? `<path d="M ${x.toFixed(0)} ${y.toFixed(0)} Q ${(x + x2) / 2} ${(y + y2) / 2 - 30} ${x2.toFixed(0)} ${y2.toFixed(0)}" fill="none" stroke="#1C1E26" stroke-width="1.6"/>`
          : `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${r.toFixed(0)}" ry="${(r * 0.6).toFixed(0)}" fill="${c}" opacity="0.7"/>`,
      );
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="${lineArt ? "#FFFFFF" : pal[2]}"/>${shapes.join("")}</svg>`;
  return svgToDataUri(svg);
}

/** Book cover thumbnail — original composition with title band. */
export function coverArt(title: string, hue = 0, bw = false): string {
  const pal = palette(hue);
  const c1 = bw ? "#2E323F" : pal[0];
  const c2 = bw ? "#5A5E6E" : pal[1];
  const bg = bw ? "#F4F4F2" : pal[2];
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > 14) {
      lines.push(cur.trim());
      cur = w;
    } else cur += " " + w;
  }
  if (cur.trim()) lines.push(cur.trim());
  const shown = lines.slice(0, 3);
  const startY = 120 - (shown.length - 1) * 16;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="260" viewBox="0 0 200 260">
  <rect width="200" height="260" fill="${bg}"/>
  <circle cx="150" cy="60" r="34" fill="${c2}" opacity="0.8"/>
  <circle cx="52" cy="200" r="46" fill="${c1}" opacity="0.9"/>
  <rect x="90" y="150" width="76" height="56" rx="10" fill="${c2}" opacity="0.6"/>
  <rect x="0" y="0" width="200" height="260" fill="none" stroke="${bw ? "#2E323F" : pal[3]}" stroke-width="6"/>
  ${shown
    .map(
      (l, i) =>
        `<text x="100" y="${startY + i * 30}" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="21" fill="${bw ? "#1C1E26" : pal[3]}">${esc(l)}</text>`,
    )
    .join("")}
</svg>`;
  return svgToDataUri(svg);
}
