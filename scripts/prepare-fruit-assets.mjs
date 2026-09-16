import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

// WaveSpeed generates/removes the background. This step only splits and optimizes.
const manifest = {};
for (const flavor of ['orange', 'watermelon', 'lime']) {
  const source = `artifacts/fruits/${flavor}/transparent.png`;
  const { width, height } = await sharp(source).metadata();
  const directory = `public/images/fruits/${flavor}`;
  await mkdir(directory, { recursive: true });
  manifest[flavor] = [];
  for (let index = 0; index < 6; index++) {
    const col = index % 3, row = Math.floor(index / 3);
    const left = Math.round(col * width / 3), top = Math.round(row * height / 2);
    const cell = await sharp(source).extract({
      left, top,
      width: Math.round((col + 1) * width / 3) - left,
      height: Math.round((row + 1) * height / 2) - top,
    }).png().toBuffer();
    const output = `${directory}/fruit-${index + 1}.webp`;
    const info = await sharp(cell).trim({ background: '#00000000', threshold: 8 })
      .webp({ quality: 94, alphaQuality: 100 }).toFile(output);
    manifest[flavor].push({ src: output.replace('public', ''), ratio: `${info.width} / ${info.height}` });
    console.log(`${flavor}/${index + 1}: ${info.width}x${info.height}`);
  }
}
await writeFile('src/components/flavor/fruit-assets.json', JSON.stringify(manifest, null, 2) + '\n');
