import { mkdir, readFile, writeFile } from "node:fs/promises";

const apiKey = process.env.WAVESPEED_API_KEY;
if (!apiKey) throw new Error("Set WAVESPEED_API_KEY before generating assets.");

const sourcePath =
  "D:/higgsfield/a51e45cf-00e7-4cf4-8b1b-5d77b1e4a534.png";
const outputDir = "public/images/blackberry";
const artifactDir = "artifacts/blackberry-layers";
const headers = {
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
};
const terminalErrors = new Set([
  "failed",
  "cancelled",
  "timeout",
  "deleted",
]);

await mkdir(outputDir, { recursive: true });
await mkdir(artifactDir, { recursive: true });

const source = await readFile(sourcePath);
const sourceDataUrl = `data:image/png;base64,${source.toString("base64")}`;
const preparedBackgroundSource = await readFile("public/images/blackberry.png");
const preparedBackgroundDataUrl = `data:image/png;base64,${preparedBackgroundSource.toString("base64")}`;

async function requestJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`${response.status}: ${(await response.text()).slice(0, 800)}`);
  }
  return response.json();
}

async function runPrediction(endpoint, body, label) {
  const submitted = await requestJson(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  let task = submitted.data ?? submitted;
  if (!task.id) throw new Error(`${label}: missing prediction id`);
  await writeFile(
    `${artifactDir}/${label}.json`,
    JSON.stringify({ id: task.id, status: task.status }, null, 2),
  );
  console.log(`${label}: submitted ${task.id}`);

  const deadline = Date.now() + 10 * 60_000;
  while (task.status !== "completed") {
    if (terminalErrors.has(task.status) || Date.now() > deadline) {
      throw new Error(`${label}: ${task.error || task.status || "timeout"}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 4000));
    const polled = await requestJson(
      `https://api.wavespeed.ai/api/v3/predictions/${task.id}/result`,
      { headers },
    );
    task = polled.data ?? polled;
  }
  if (!task.outputs?.[0]) throw new Error(`${label}: no output`);
  return task.outputs[0];
}

async function download(url, path) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${path}: download ${response.status}`);
  await writeFile(path, Buffer.from(await response.arrayBuffer()));
}

const sharedIsolation = `Use the supplied Blackberry advertising artwork as the sole visual reference. Keep the selected subject at the exact same position, scale, perspective, lighting and photographic texture in the original 16:9 canvas. Remove every other object, fruit, hand, cup, line, word and interface element. Put the selected subject on a perfectly flat chroma green (#00ff00) background with no shadow on that background. Do not add text or watermarks. Preserve fine edges. Where the selected subject is hidden, reconstruct only the minimum anatomically or physically plausible area required for the object to move independently.`;

const layers = [
  {
    id: "hand",
    prompt: `${sharedIsolation} The selected subject is ONLY the realistic human hand and forearm. Remove the cup from the grip. Reconstruct the palm and all finger surfaces hidden by the cup so the empty hand still forms a natural open grip ready to receive another cup. Keep black nail polish.`,
  },
  {
    id: "cup",
    prompt: `${sharedIsolation} The selected subject is ONLY the complete purple Mojito takeaway cup with its white lid and all artwork printed or attached to the cup. Remove the hand completely. Reconstruct the cup areas hidden by fingers while preserving the cylindrical shape, label, white drip graphic, condensation and highlights.`,
  },
  {
    id: "fruit-1",
    prompt: `${sharedIsolation} The selected subject is ONLY the large whole blackberry floating to the left of the cup, around x=35%, y=33%. Preserve every glossy drupelet.`,
  },
  {
    id: "fruit-2",
    prompt: `${sharedIsolation} The selected subject is ONLY the red blackberry cross-section floating in the upper-right, around x=70%, y=31%. Preserve its irregular outline and wet glossy center.`,
  },
  {
    id: "fruit-3",
    prompt: `${sharedIsolation} The selected subject is ONLY the smaller red blackberry cross-section floating immediately to the right of the hand, around x=64%, y=48%. Reconstruct the small portion hidden by the fingers.`,
  },
  {
    id: "fruit-4",
    prompt: `${sharedIsolation} The selected subject is ONLY the whole blackberry floating in the lower-right, around x=72%, y=61%. Preserve every glossy drupelet.`,
  },
  {
    id: "fruit-5",
    prompt: `${sharedIsolation} The selected subject is ONLY the red blackberry cross-section floating in the lower-left, around x=37%, y=67%. Preserve the wet glossy texture.`,
  },
  {
    id: "fruit-6",
    prompt: `${sharedIsolation} The selected subject is ONLY the small partially hidden red blackberry cross-section just left of the wrist, around x=45%, y=59%. Reconstruct the portion hidden by the hand so it becomes a complete independent fruit.`,
  },
];

const backgroundPrompt = `Use the supplied Blackberry advertising artwork as the exact composition reference. Create a clean 16:9 background plate only. Preserve the purple paper-like texture and the white liquid wave along the bottom at the same height and shape. Remove the hand, cup, every blackberry, all white curly lines, all words, headings, descriptions, buttons, search field, avatar, logo and menu icon. Seamlessly reconstruct the purple texture and white lower area. No objects, text, lines, shadows, fruit, hand, cup or watermark.`;

const editEndpoint = "https://api.wavespeed.ai/api/v3/google/nano-banana/edit";
const removerEndpoint =
  "https://api.wavespeed.ai/api/v3/wavespeed-ai/image-background-remover";

const backgroundUrl = await runPrediction(
  editEndpoint,
  {
    prompt: backgroundPrompt,
    images: [preparedBackgroundDataUrl],
    aspect_ratio: "16:9",
    output_format: "png",
  },
  "background-edit",
);
await download(backgroundUrl, `${outputDir}/background.png`);
console.log("background: saved");

if (process.argv.includes("--background-only")) process.exit(0);

await Promise.all(
  layers.map(async ({ id, prompt }) => {
    const isolatedUrl = await runPrediction(
      editEndpoint,
      {
        prompt,
        images: [sourceDataUrl],
        aspect_ratio: "16:9",
        output_format: "png",
      },
      `${id}-edit`,
    );
    const transparentUrl = await runPrediction(
      removerEndpoint,
      { image: isolatedUrl },
      `${id}-alpha`,
    );
    await download(transparentUrl, `${outputDir}/${id}.png`);
    console.log(`${id}: saved with alpha`);
  }),
);
