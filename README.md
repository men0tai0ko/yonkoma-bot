# yonkoma-bot 🤖🐱

### 🔗 [ダッシュボードを開く(別ウィンドウ推奨: Ctrl/Cmdキーを押しながらクリック)](https://men0tai0ko.github.io/yonkoma-bot/)

毎朝 GitHub Actions が自動で起動し、AIがランダムなお題から4コマ漫画の台本を書き、
SVGパーツを組み合わせて1本の4コマを生成します。結果は GitHub Pages のギャラリーで
閲覧でき、直近の実行が成功したか失敗したかもページ上で確認できます。

> GitHubのREADME上のリンクは仕様上 `target="_blank"` が付けられないため、
> 新しいタブ/ウィンドウで開きたい場合はリンクを **Ctrl+クリック**(Macは**Cmd+クリック**)
> するか、右クリック→「新しいタブで開く」を選んでください。

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

## GitHubでの運用状況

- リポジトリ: https://github.com/men0tai0ko/yonkoma-bot
- ダッシュボード: https://men0tai0ko.github.io/yonkoma-bot/ (Pages設定: `main` ブランチ / `/docs`)
- ワークフロー: [Daily Comic](https://github.com/men0tai0ko/yonkoma-bot/actions/workflows/daily-comic.yml)(毎日 09:00 JST に自動実行、`workflow_dispatch` で手動実行も可能)

まだ `ANTHROPIC_API_KEY` は未設定のため、現在は内蔵の簡易テンプレ台本で動いています。
AIによる台本生成に切り替えるには、リポジトリの **Settings → Secrets and variables → Actions**
で `ANTHROPIC_API_KEY` を登録してください(未設定でもフォールバックで動き続けます)。

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
