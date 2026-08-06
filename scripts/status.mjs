// docs/comics/status.json への書き込みを共通化するユーティリティ。
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const COMICS_DIR = path.join(__dirname, "..", "docs", "comics");
export const STATUS_PATH = path.join(COMICS_DIR, "status.json");

export function writeStatus(status, extra = {}) {
  const runId = process.env.GITHUB_RUN_ID || null;
  const serverUrl = process.env.GITHUB_SERVER_URL;
  const repo = process.env.GITHUB_REPOSITORY;
  const runUrl = runId && serverUrl && repo ? `${serverUrl}/${repo}/actions/runs/${runId}` : null;
  const payload = {
    timestamp: new Date().toISOString(),
    status,
    runId,
    runUrl,
    ...extra,
  };
  mkdirSync(COMICS_DIR, { recursive: true });
  writeFileSync(STATUS_PATH, JSON.stringify(payload, null, 2), "utf-8");
  return payload;
}
