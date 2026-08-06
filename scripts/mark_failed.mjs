// generate_script.mjs 自体が落ちた場合など、render_comic.mjs まで到達できなかった
// ケースをブラウザ側のステータス表示に反映させるための最終防衛ライン。
import { writeStatus } from "./status.mjs";

const reason = process.argv[2] || "ワークフローの途中で失敗しました";
writeStatus("failed", { error: reason });
console.log(`status.json に失敗を記録しました: ${reason}`);
