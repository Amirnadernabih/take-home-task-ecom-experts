import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input = path.join(__dirname, 'assets/satisfaction-badge-source.png');
const output = path.join(__dirname, '../public/products/satisfaction-badge.png');

const THRESHOLD = 35;

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  if (r <= THRESHOLD && g <= THRESHOLD && b <= THRESHOLD) {
    data[i + 3] = 0;
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toFile(output);

let transparent = 0;
for (let i = 3; i < data.length; i += 4) {
  if (data[i] === 0) transparent++;
}

console.log(`Wrote ${output} (${transparent} transparent pixels of ${data.length / 4})`);
