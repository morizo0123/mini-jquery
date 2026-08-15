# MiniJQuery (Vite + TypeScript)

Vite と TypeScript で作成した学習用の自作 jQuery (ミニライブラリ) です。  
DOM 操作の裏側の仕組み、メソッドチェーン、Declaration Merging (型の自動統合) を用いたプラグイン拡張の学習を目的としています。

---

## 🛠 テックスタック

* **ビルドツール:** [Vite](https://vitejs.dev/)
* **言語:** [TypeScript](https://www.typescriptlang.org/)
* **パッケージマネージャー:** pnpm

---

## 📁 フォルダ構成

```text
mini-jquery/
├── index.html
├── package.json
├── tsconfig.json
└── src/
    ├── main.ts                   # 動作確認・テスト用エントリーポイント
    └── mini-jquery/
        ├── core.ts               # MiniJQuery クラス本体と型定義
        ├── index.ts              # エントリーポイント ($ 関数の定義・モジュール結合)
        └── plugins/
            └── css.ts            # css() メソッドのプロトタイプ拡張プラグイン
```
