/**
 * One-off restyle codemod: Cobalt/Navy/Orange palette -> Airform One Studio palette.
 * Only touches className colour/radius/shadow tokens. No logic changes.
 * Usage: node scripts/restyle-airform.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('client/src');
const SKIP = /(HeroSection|CloserLook3DSection|Laptop3DCanvas|CollectionsSection|BestsellersSection|PromoBannerSection|FeatureStrip|Navbar|MobileBottomNav|Footer|ProductCard|HomePage|ShopPage|Reveal)\.jsx$/;

const HEX = {
  '0B5FFF': '1D2129', '0847C4': '323846', '0B1220': '1D2129', '162238': '323846',
  '12264A': '23272F', '112447': '23272F', '10203E': '23272F', '0D285B': '23272F',
  'EEF4FF': 'ECEFF4', 'F4F6FA': 'F7F8FA', 'F8FAFC': 'F7F8FA', 'EEF2F7': 'ECEFF4',
  'F1F5F9': 'ECEFF4', 'E8EEF6': 'ECEFF4', 'FCFDFE': 'F7F8FA', 'FCFCFD': 'F7F8FA',
  'F8F8FA': 'F7F8FA', 'C7DCFF': 'D4DBE5', 'DCE8FF': 'D4DBE5', '38BDF8': '9BB0C9',
  'F97316': '1D2129', 'FFF7ED': 'ECEFF4', 'FDBA74': 'D4DBE5', 'C2410C': '323846',
  '9A3412': '323846'
};

const SLATE = {
  50: 'F7F8FA', 100: 'ECEFF4', 200: 'E2E7EE', 300: 'BAC4D2', 400: '8692A3',
  500: '647082', 600: '4F627A', 700: '323846', 800: '23272F', 900: '1D2129'
};

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (p.endsWith('.jsx') && !SKIP.test(p)) out.push(p);
  }
  return out;
}

let changedFiles = 0;
for (const file of walk(ROOT)) {
  const src = fs.readFileSync(file, 'utf8');
  let s = src;

  // 1. Remove decorative tech-grid overlays
  s = s.replace(/<div className="absolute inset-0 tc-tech-grid[^"]*"\s*\/>\s*/g, '');

  // 2. Replace gradients with flat fills (light gradients -> mist, dark/accent -> ink)
  s = s.replace(
    /bg-gradient-to-\w+\s+from-\[#([0-9A-Fa-f]{6})\](?:\s+via-\[#[0-9A-Fa-f]{6}\])?\s+to-\[#[0-9A-Fa-f]{6}\]/g,
    (_, from) => (/^(FFFFFF|F|E)/i.test(from) ? 'bg-[#ECEFF4]' : 'bg-[#1D2129]')
  );

  // 3. Hex remap (case-insensitive)
  s = s.replace(/#([0-9A-Fa-f]{6})\b/g, (m, h) => {
    const to = HEX[h.toUpperCase()];
    return to ? `#${to}` : m;
  });

  // 4. Tailwind slate-* -> studio neutrals (keeps /opacity suffix)
  s = s.replace(
    /\b(text|bg|border|border-[trblxy]|ring|divide|placeholder|fill|stroke|accent|caret|outline)-slate-(50|100|200|300|400|500|600|700|800|900)\b/g,
    (_, p, n) => `${p}-[#${SLATE[n]}]`
  );

  // 5. Radius + shadow tokens
  s = s
    .replace(/\brounded-3xl\b/g, 'rounded-[24px]')
    .replace(/\brounded-2xl\b/g, 'rounded-[20px]')
    .replace(/\bshadow-tc-card\b/g, 'shadow-tc-studio')
    .replace(/\bshadow-tc-hover\b/g, 'shadow-tc-lift')
    .replace(/\bshadow-tc-float\b/g, 'shadow-tc-lift')
    .replace(/\s?\bshadow-tc-primary\b/g, '');

  if (s !== src) {
    fs.writeFileSync(file, s);
    changedFiles++;
    console.log('restyled', path.relative(ROOT, file));
  }
}
console.log(`Done. ${changedFiles} files updated.`);

