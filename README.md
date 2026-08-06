# yonkoma-bot 🤖🐱

毎朝 GitHub Actions が自動で起動し、AIがランダムなお題から4コマ漫画の台本を書き、
SVGパーツを組み合わせて1本の4コマを生成します。結果は GitHub Pages のギャラリーで
閲覧でき、直近の実行が成功したか失敗したかもページ上で確認できます。

登場人物は固定の2人組:

- **ロボ子** — 水色の四角い頭のロボット。動じないボケ役。
- **にゃん太** — オレンジの猫。テンション高めのツッコミ役。

## ローカルでの動作確認

```bash
npm run comic
```

`scripts/generate_script.mjs` が台本(JSON)を作り、`scripts/render_comic.mjs` が
`docs/comics/YYYY-MM-DD.svg` を生成して `docs/comics/index.json` / `status.json` を更新します。
`docs/index.html` をブラウザで開く際は、`fetch` を使うため簡易サーバー経由で開いてください
(`file://` 直開きだとJSON読み込みがブロックされます)。

```bash
python -m http.server 4173 --directory docs
```

## GitHubでの運用開始手順

1. このフォルダをGitHubリポジトリとしてpushする
2. リポジトリの **Settings → Secrets and variables → Actions** で `ANTHROPIC_API_KEY` を登録する
   (未設定でも動きますが、内蔵の簡易テンプレ台本にフォールバックします)
3. **Settings → Pages** で Source を「Deploy from a branch」、Branch を `main` / `/docs` に設定する
4. **Actions** タブの `Daily Comic` ワークフローを一度 `Run workflow` で手動実行し、
   `docs/comics/` にファイルがコミットされることを確認する
5. 公開URL (`https://<owner>.github.io/<repo>/`) にアクセスすると、
   自動でowner/repoを検出してActionsのステータスバッジも表示されます

以降は毎日 09:00 JST (`cron: '0 0 * * *'`) に自動実行されます。

## 生成が失敗したとき

`generate_script.mjs` / `render_comic.mjs` のどちらが失敗しても、
`docs/comics/status.json` に失敗理由が書き込まれ、Pages側のステータスバッジが
赤色の「失敗」表示に切り替わります。GitHub公式のワークフローバッジと合わせて
二重に実行状況を確認できます。

## ディレクトリ構成

```
scripts/            生成ロジック(お題生成・レンダリング・ステータス書き込み)
assets/parts/        キャラクター・背景・吹き出しのSVGパーツ(JS関数)
docs/                GitHub Pagesとして公開するギャラリーサイト + 生成物置き場
.github/workflows/   毎日実行するGitHub Actionsワークフロー
```
