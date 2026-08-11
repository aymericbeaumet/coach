// Derives every app icon from the generated logo master using macOS' built-in sips.
import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'icons');
const SOURCE = join(OUT, 'logo-source.png');
mkdirSync(OUT, { recursive: true });

if (process.platform !== 'darwin') {
  throw new Error('Icon generation requires macOS (sips). The generated PNGs are committed.');
}

for (const [name, size] of [
  ['icon-32.png', 32],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  const result = spawnSync('sips', ['-z', String(size), String(size), SOURCE, '--out', join(OUT, name)], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
  console.log('wrote', name);
}
