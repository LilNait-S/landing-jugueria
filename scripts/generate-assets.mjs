import { readFile, mkdir, writeFile } from "node:fs/promises";

// This script is build-time tooling only. The API key never enters the browser.
const key = process.env.WAVESPEED_API_KEY;
if (!key) throw new Error("Set WAVESPEED_API_KEY before generating assets.");
const sources = [
  ["orange", "75116d1a-1477-43d9-b7b2-c7ad4c848ef2"],
  ["watermelon", "31f290e6-2970-4272-84f5-c87a77c55175"],
  ["lime", "c8fc88e0-0f74-4a34-83d2-791ab3a23502"],
  ["blackberry", "a51e45cf-00e7-4cf4-8b1b-5d77b1e4a534"],
];
const headers = {
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};
await mkdir("public/images", { recursive: true });
await mkdir("artifacts", { recursive: true });
const prompt =
  "Prepare this exact advertising artwork as a clean website background plate. Preserve the original composition, colors, texture, white liquid drip wave, floating fruit, and especially the central realistic hand holding the branded Mojito cup EXACTLY as shown in the input. Keep all printing ON THE CUP intact. Erase the entire website UI: top-left hamburger and Mojito wordmark, top-right search bar and avatar, bottom-left flavor heading and description, bottom-right arrow buttons. Also erase the two large handwritten words, but KEEP the fine white curly decorative lines with their endpoints. Seamlessly inpaint removed upper elements with the same colored textured background; removed bottom elements with the existing white background. Do not add any text, new elements or watermarks. The output must be the same full 16:9 composition, hand reaching bottom edge, with large empty areas left and right for HTML overlays. This is photographic artwork, not a web page. Preserve original positions and scale.";
await Promise.all(
  sources.map(async ([name, id]) => {
    const image = await readFile(`D:/higgsfield/${id}.png`);
    const res = await fetch(
      "https://api.wavespeed.ai/api/v3/google/nano-banana/edit",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          prompt,
          images: [`data:image/png;base64,${image.toString("base64")}`],
          aspect_ratio: "16:9",
          output_format: "png",
        }),
      },
    );
    if (!res.ok)
      throw new Error(
        `${name}: submit ${res.status}: ${(await res.text()).slice(0, 500)}`,
      );
    let task = (await res.json()).data;
    console.log(`${name}: submitted ${task.id}`);
    await writeFile(
      `artifacts/${name}-prediction.json`,
      JSON.stringify({ id: task.id, source: id }),
    );
    const deadline = Date.now() + 480_000;
    while (task.status !== "completed") {
      if (task.status === "failed" || Date.now() > deadline)
        throw new Error(`${name}: ${task.error || "generation timeout"}`);
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const poll = await fetch(
        `https://api.wavespeed.ai/api/v3/predictions/${task.id}/result`,
        { headers },
      );
      if (!poll.ok) throw new Error(`${name}: polling ${poll.status}`);
      task = (await poll.json()).data;
    }
    const download = await fetch(task.outputs[0]);
    if (!download.ok) throw new Error(`${name}: download failed`);
    await writeFile(
      `public/images/${name}.png`,
      Buffer.from(await download.arrayBuffer()),
    );
    console.log(`${name}: saved`);
  }),
);
