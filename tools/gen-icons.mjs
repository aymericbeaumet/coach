// Generates the PWA icons (no external deps — raw PNG encoder in pure Node).
// Full-bleed dark square with an orange kettlebell, supersampled for smooth edges.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'icons');
mkdirSync(OUT, { recursive: true });

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (~c) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function png(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type RGBA
  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    rgba.copy(raw, y * stride + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// Kettlebell silhouette in normalized [0,1] coordinates.
function inKettlebell(nx, ny) {
  const bell = Math.hypot(nx - 0.5, ny - 0.66) < 0.27;
  const d = Math.hypot(nx - 0.5, ny - 0.31);
  const handle = d > 0.085 && d < 0.15;
  return bell || handle;
}

function render(size) {
  const W = size, H = size, SS = 4;
  const rgba = Buffer.alloc(W * H * 4);
  const bg = [15, 23, 42];     // #0f172a
  const fg = [249, 115, 22];   // #f97316
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let cov = 0;
      for (let sy = 0; sy < SS; sy++)
        for (let sx = 0; sx < SS; sx++) {
          const nx = (x + (sx + 0.5) / SS) / W;
          const ny = (y + (sy + 0.5) / SS) / H;
          if (inKettlebell(nx, ny)) cov++;
        }
      cov /= SS * SS;
      const i = (y * W + x) * 4;
      rgba[i]     = Math.round(bg[0] + (fg[0] - bg[0]) * cov);
      rgba[i + 1] = Math.round(bg[1] + (fg[1] - bg[1]) * cov);
      rgba[i + 2] = Math.round(bg[2] + (fg[2] - bg[2]) * cov);
      rgba[i + 3] = 255;
    }
  }
  return png(W, H, rgba);
}

for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
  writeFileSync(join(OUT, name), render(size));
  console.log('wrote', name);
}
