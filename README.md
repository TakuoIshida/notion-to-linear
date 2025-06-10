# notion-to-linear
notion から linearにチケットを移行するためのCLI ツール

## セットアップ

```
volta install node@24.1.0
```

```
pnpm install
```

環境変数は、.env.templateを参考に設定してください。

```
node -v
```

## 使い方
index.tsにコメントアウトされてる、チーム一覧、プロジェクト一覧で、移行先のteamID, projectIDを取得してください。
notionClientのfilter条件の調整は各自で。

移行実行
```
node index.ts
```

## notionから移行できる対象
- タイトル
- ステータス（未着手・進行中のみ）
- 担当者
- story point

## 参考
node 23.6以降では、tsc不要で、node index.tsでOK。
※ただし, import したfile extentionは.tsをつけないといけない（※biomeでextentionを自動付与する機能はない）
https://zenn.dev/ubie_dev/articles/ts-58-erasable-syntax-only