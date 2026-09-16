import { constants } from "node:fs";
import { copyFile, mkdir, rename } from "node:fs/promises";
import sharp from "sharp";

const imageDir = "public/images/blackberry";
const originalsDir = "artifacts/blackberry-layers/full-frame";
const transparentLayers = [
  "hand",
  "cup",
  "fruit-1",
  "fruit-2",
  "fruit-3",
  "fruit-4",
  "fruit-5",
  "fruit-6",
];

await mkdir(originalsDir, { recursive: true });

for (const name of transparentLayers) {
  const source = `${imageDir}/${name}.png`;
  try {
    await copyFile(
      source,
      `${originalsDir}/${name}.png`,
      constants.COPYFILE_EXCL,
    );
  } catch (error) {
    if (error?.code !== "EEXIST") throw error;
  }

  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Neutralize chroma-green spill in partially transparent edge pixels.
  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const alpha = data[index + 3];
    const neutralCeiling = Math.max(red, blue);
    if (alpha < 250 && green > neutralCeiling * 1.04 + 3) {
      data[index + 1] = neutralCeiling;
    }
  }

  const temporary = `${imageDir}/${name}.optimized.png`;
  const result = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ background: "#00000000", threshold: 8 })
    .png({ compressionLevel: 9 })
    .toFile(temporary);
  await rename(temporary, source);
  await sharp(source)
    .webp({ quality: 92, alphaQuality: 100, smartSubsample: true })
    .toFile(`${imageDir}/${name}.webp`);
  console.log(`${name}: ${result.width}x${result.height}`);
}

await sharp(`${imageDir}/background.png`)
  .webp({ quality: 92, smartSubsample: true })
  .toFile(`${imageDir}/background.webp`);
