// 台本JSON(script.output.json)を読み、4コマ漫画を1枚のSVGに合成して
// docs/comics/ 以下に出力する。index.json / status.json も更新する。
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { renderCharacter } from "../assets/parts/characters.mjs";
import { background } from "../assets/parts/backgrounds.mjs";
import { bubble } from "../assets/parts/bubbles.mjs";
import { writeStatus, COMICS_DIR } from "./status.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT_PATH = path.join(__dirname, "script.output.json");
const INDEX_PATH = path.join(COMICS_DIR, "index.json");

const PANEL_W = 380;
const PANEL_H = 380;
const GUTTER = 20;
const MARGIN = 20;
const TITLE_H = 70;
const CANVAS_W = MARGIN * 2 + PANEL_W * 2 + GUTTER;
const CANVAS_H = TITLE_H + MARGIN * 2 + PANEL_H * 2 + GUTTER;

const PANEL_POS = [
  { x: MARGIN, y: TITLE_H + MARGIN },
  { x: MARGIN + PANEL_W + GUTTER, y: TITLE_H + MARGIN },
  { x: MARGIN, y: TITLE_H + MARGIN + PANEL_H + GUTTER },
  { x: MARGIN + PANEL_W + GUTTER, y: TITLE_H + MARGIN + PANEL_H + GUTTER },
];

function bgTypeForEmotion(emotion) {
  switch (emotion) {
    case "surprised":
    case "angry":
      return "impact";
    case "sad":
      return "night";
    case "happy":
      return "dots";
    default:
      return "plain";
  }
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderPanel(panel, index) {
  const side = index % 2 === 0 ? "right" : "left";
  const primaryX = side === "right" ? PANEL_W * 0.66 : PANEL_W * 0.34;
  const otherX = side === "right" ? PANEL_W * 0.2 : PANEL_W * 0.8;
  const bgType = bgTypeForEmotion(panel.emotion);

  let content = background(bgType, index, PANEL_W, PANEL_H);

  if (panel.speaker === "narration") {
    content += renderCharacter("robo", { x: PANEL_W * 0.32, y: PANEL_H * 0.86, expression: "neutral", pose: "stand" });
    content += renderCharacter("nyan", { x: PANEL_W * 0.68, y: PANEL_H * 0.9, expression: "neutral", pose: "stand", flip: true });
    content += bubble({
      type: "narration",
      text: panel.dialogue,
      x: PANEL_W * 0.06,
      y: PANEL_H * 0.06,
      w: PANEL_W * 0.88,
      h: PANEL_H * 0.22,
    });
  } else {
    const other = panel.speaker === "robo" ? "nyan" : "robo";
    content += renderCharacter(other, {
      x: otherX,
      y: PANEL_H * 0.92,
      expression: "neutral",
      pose: "stand",
      flip: side === "right",
    });
    content += renderCharacter(panel.speaker, {
      x: primaryX,
      y: PANEL_H * 0.86,
      expression: panel.emotion,
      pose: panel.gesture,
      flip: side === "left",
    });
    const bubbleType = ["angry", "surprised"].includes(panel.emotion) ? "shout" : "speech";
    const bubbleW = PANEL_W * 0.62;
    const bubbleH = 92;
    content += bubble({
      type: bubbleType,
      text: panel.dialogue,
      x: side === "right" ? PANEL_W * 0.06 : PANEL_W * 0.32,
      y: PANEL_H * 0.08,
      w: bubbleW,
      h: bubbleH,
      tailTo: side === "right" ? "bottom-right" : "bottom-left",
    });
  }

  const { x, y } = PANEL_POS[index];
  return `
  <g transform="translate(${x} ${y})">
    <clipPath id="panel-clip-${index}"><rect x="0" y="0" width="${PANEL_W}" height="${PANEL_H}" rx="10"/></clipPath>
    <g clip-path="url(#panel-clip-${index})">${content}</g>
    <rect x="0" y="0" width="${PANEL_W}" height="${PANEL_H}" rx="10" fill="none" stroke="#222222" stroke-width="4"/>
  </g>`;
}

function buildSvg(script) {
  const panels = script.panels.map(renderPanel).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}" font-family="'Hiragino Sans','Yu Gothic',sans-serif">
  <rect x="0" y="0" width="${CANVAS_W}" height="${CANVAS_H}" fill="#FFFFFF"/>
  <text x="${CANVAS_W / 2}" y="${TITLE_H * 0.62}" text-anchor="middle" font-size="30" font-weight="700" fill="#222222">${escapeXml(script.title)}</text>
  ${panels}
</svg>`;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function updateIndex(entry) {
  let list = [];
  if (existsSync(INDEX_PATH)) {
    try {
      list = JSON.parse(readFileSync(INDEX_PATH, "utf-8"));
    } catch {
      list = [];
    }
  }
  list = list.filter((e) => e.date !== entry.date);
  list.unshift(entry);
  list = list.slice(0, 60);
  writeFileSync(INDEX_PATH, JSON.stringify(list, null, 2), "utf-8");
}

function main() {
  mkdirSync(COMICS_DIR, { recursive: true });

  const script = JSON.parse(readFileSync(SCRIPT_PATH, "utf-8"));
  const date = todayKey();
  const fileName = `${date}.svg`;
  const svg = buildSvg(script);

  writeFileSync(path.join(COMICS_DIR, fileName), svg, "utf-8");
  updateIndex({ date, title: script.title, path: `comics/${fileName}`, source: script.source });
  writeStatus("success", { title: script.title, source: script.source });

  console.log(`4コマを生成しました: docs/comics/${fileName}`);
}

try {
  main();
} catch (err) {
  console.error("render_comic.mjs 致命的エラー:", err);
  try {
    mkdirSync(COMICS_DIR, { recursive: true });
    writeStatus("failed", { error: String(err?.message || err) });
  } catch {
    // status.json すら書けない場合は諦める
  }
  process.exit(1);
}
