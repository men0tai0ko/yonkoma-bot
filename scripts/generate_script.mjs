// ランダムなお題からAIに4コマ漫画の台本(JSON)を書かせる。
// APIキーが無い/失敗した場合は内蔵テンプレートにフォールバックし、パイプラインを止めない。
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "script.output.json");

const SPEAKERS = ["robo", "nyan", "narration"];
const EMOTIONS = ["neutral", "happy", "surprised", "angry", "sad"];
const GESTURES = ["stand", "point", "jump"];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function loadTopics() {
  const raw = readFileSync(path.join(__dirname, "topics.json"), "utf-8");
  return JSON.parse(raw);
}

function buildSeed(topics) {
  return {
    place: pick(topics.places),
    event: pick(topics.events),
    twist: pick(topics.twists),
  };
}

function sanitizePanels(panels) {
  if (!Array.isArray(panels) || panels.length === 0) return null;
  const cleaned = panels.slice(0, 4).map((p) => ({
    speaker: SPEAKERS.includes(p?.speaker) ? p.speaker : "narration",
    emotion: EMOTIONS.includes(p?.emotion) ? p.emotion : "neutral",
    gesture: GESTURES.includes(p?.gesture) ? p.gesture : "stand",
    dialogue: typeof p?.dialogue === "string" && p.dialogue.trim() ? p.dialogue.trim().slice(0, 28) : "……",
  }));
  while (cleaned.length < 4) {
    cleaned.push({ speaker: "narration", emotion: "neutral", gesture: "stand", dialogue: "……" });
  }
  return cleaned;
}

function fallbackScript(seed) {
  const title = `${seed.place}にて`.slice(0, 18);
  const panels = [
    {
      speaker: "narration",
      emotion: "neutral",
      gesture: "stand",
      dialogue: `${seed.place}。${seed.event}`.slice(0, 26),
    },
    {
      speaker: "robo",
      emotion: "surprised",
      gesture: "stand",
      dialogue: "え、これどうすれば…!?",
    },
    {
      speaker: "nyan",
      emotion: "happy",
      gesture: "point",
      dialogue: "まあ落ち着きなニャ",
    },
    {
      speaker: "narration",
      emotion: "happy",
      gesture: "jump",
      dialogue: `結局、${seed.twist}`.slice(0, 26),
    },
  ];
  return { title, panels: sanitizePanels(panels), source: "fallback" };
}

async function callClaude(seed) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const prompt = `あなたは4コマ漫画の脚本家です。以下のお題で、ロボ子(冷静なボケ役ロボット)とにゃん太(テンション高めのツッコミ役ネコ)が登場する、ゆるく笑える4コマ漫画の台本を考えてください。

お題:
- 場所: ${seed.place}
- 出来事: ${seed.event}
- オチの方向性: ${seed.twist}

出力は次のJSONスキーマ「のみ」を返してください。説明文やコードフェンスは不要です。
{
  "title": "8〜16文字程度の短いタイトル",
  "panels": [
    {"speaker": "robo|nyan|narration", "emotion": "neutral|happy|surprised|angry|sad", "gesture": "stand|point|jump", "dialogue": "18文字以内のセリフ"},
    ... 必ず4要素
  ]
}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 700,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      console.error(`Claude API error: ${res.status} ${await res.text()}`);
      return null;
    }

    const data = await res.json();
    const text = data?.content?.[0]?.text ?? "";
    const jsonText = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(jsonText);
    const panels = sanitizePanels(parsed.panels);
    if (!panels) return null;
    const title = typeof parsed.title === "string" && parsed.title.trim() ? parsed.title.trim().slice(0, 20) : `${seed.place}の一幕`;
    return { title, panels, source: "claude" };
  } catch (err) {
    console.error("Claude API呼び出しに失敗、フォールバックします:", err.message);
    return null;
  }
}

async function main() {
  const topics = loadTopics();
  const seed = buildSeed(topics);

  let script = await callClaude(seed);
  if (!script) script = fallbackScript(seed);

  script.seed = seed;
  script.generatedAt = new Date().toISOString();

  mkdirSync(__dirname, { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(script, null, 2), "utf-8");
  console.log(`台本を生成しました (source=${script.source}): ${OUT_PATH}`);
}

main().catch((err) => {
  console.error("generate_script.mjs 致命的エラー:", err);
  process.exit(1);
});
