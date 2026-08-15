# MiniJQuery (Vite + TypeScript)

Vite と TypeScript で作成した学習用の自作 jQuery (ミニライブラリ) です。  
DOM 操作の裏側の仕組み、メソッドチェーン、Declaration Merging (型の自動統合) を用いたプラグイン拡張の学習を目的としています。

---

## 🛠 テックスタック

- **ビルドツール:** [Vite](https://vitejs.dev/)
- **言語:** [TypeScript](https://www.typescriptlang.org/)
- **パッケージマネージャー:** pnpm

---

## 📁 フォルダ構成

```text
mini-jquery/
├── index.html                  # テスト用HTML
├── package.json
├── tsconfig.json
└── src/
    ├── main.ts                 # 動作確認用（lib/index から $ を呼び出す）
    │
    └── lib/                    # 💡 自作ライブラリのコードはすべてここに入れる
        ├── index.ts            # ライブラリの総合窓口 ($ 関数のエクスポート)
        ├── core.ts             # MiniJQuery クラス本体
        ├── modules/            # 標準機能モジュール
        │   ├── styles/
        │   │   └── css.ts
        │   └── dom/
        │       └── attr.ts
        └── utils/              # 内部用ヘルパー関数（例: 型チェック関数など）
            └── isElement.ts
```
