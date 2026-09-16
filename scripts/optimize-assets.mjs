import sharp from "sharp";

for (const flavor of ["orange", "watermelon", "lime", "blackberry"]) {
  const result = await sharp(`public/images/${flavor}.png`)
    .webp({ quality: 90 })
    .toFile(`public/images/${flavor}.webp`);
  console.log(`${flavor}: ${Math.round(result.size / 1024)} KB`);
}
