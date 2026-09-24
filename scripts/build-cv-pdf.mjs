// Post-build: render dist/cv/ to a PDF with headless Chrome and save it next to the page.
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const PORT = 4399;
const OUT = resolve('dist/cv/thomas-konstantinovsky-cv.pdf');
const CANDIDATES = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', process.env.CHROME_BIN].filter(Boolean);

function findChrome() {
  for (const c of CANDIDATES) {
    try { execFileSync('which', [c], { stdio: 'ignore' }); return c; } catch {}
  }
  return null;
}

async function waitFor(url, ms = 20000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    try { const r = await fetch(url); if (r.ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`preview server did not answer at ${url}`);
}

const chrome = findChrome();
if (!chrome) { console.warn('[cv-pdf] no Chrome found; skipping PDF generation'); process.exit(0); }
if (!existsSync('dist/cv/index.html')) { console.warn('[cv-pdf] dist/cv/index.html missing; skipping'); process.exit(0); }

const preview = spawn('npx', ['astro', 'preview', '--port', String(PORT), '--host', '127.0.0.1'], { stdio: 'ignore' });
try {
  const url = `http://127.0.0.1:${PORT}/cv/?print`;
  await waitFor(url);
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=4000', '--no-pdf-header-footer', `--print-to-pdf=${OUT}`, url,
  ], { stdio: 'ignore' });
  console.log(`[cv-pdf] wrote ${OUT} (${(statSync(OUT).size / 1024).toFixed(0)} KB)`);
} finally {
  preview.kill('SIGTERM');
}
