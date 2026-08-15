# Vite + TypeScript で作る自作 MiniJQuery

TypeScriptの「Declaration Merging（型統合）」と「プラグイン形式のプロトタイプ拡張」を採用した、中規模開発に耐えうる拡張性と型安全性を兼ね備えた設計です。

```ts
mini-jquery/
├── index.html
├── package.json
├── tsconfig.json
└── src/
    ├── main.ts                # テスト・動作確認用
    └── mini-jquery/
        ├── core.ts            # クラス本体と基本メソッド、型統合用interface
        ├── index.ts           # $ 関数の定義とモジュールの公開
        └── plugins/
            └── css.ts         # プロトタイプ拡張プラグイン（cssメソッド）
```

## src/mini-jquery/core.ts

`elements: T[]` 配列構造と基本メソッド、および型拡張（Declaration Merging）のための空インターフェースを定義します。

### なぜ `elements: T[]` (配列) で定義するのか？

自作 jQuery (`MiniJQuery`) において、保持する要素を単一の DOM (`element: T`) ではなく **配列 (`elements: T[]`)** として定義する最大の理由は、**「複数要素の一括操作」と「安全なメソッドチェーンの維持」を両立するため**です。

---

#### 理由 1: `querySelectorAll` による複数ヒットに対応するため

CSS セレクタ指定（例: `$('#box .inner p')` や `$('button')`）を行った場合、一致する HTML 要素は **1 つとは限らず、複数存在（あるいは 0 件）** します。

JavaScript 標準の `document.querySelectorAll()` は、ヒットしたすべての要素を `NodeList`（配列風オブジェクト）として返します。これをそのまま配列に変換して保持するために `elements: T[]` としています。

```ts
// セレクタにマッチしたすべての DOM 要素を配列として保持
const nodes = Array.from(document.querySelectorAll('#box .inner p'));
// 内部状態: elements = [p要素1, p要素2, p要素3]
// 呼び出し側: 要素が何個あっても 1 行で書ける
$('#box .inner p').addClass('highlight');
```

#### 理由 2: 呼び出し側のコードを変えずに「一括操作」するため

jQuery の最も強力な設計思想は、「要素が 1 個でも 100 個でも、同じ 1 行のコードで操作できること」 です。
elements を配列にしておくことで、各メソッド内部で forEach による繰り返し処理を行えるようになります。

```ts
// 呼び出し側: 要素が何個あっても 1 行で書ける
$('#box .inner p').addClass('highlight');

// --- 内部実装 (core.ts) ---
addClass(...classNames: string[]): this {
  // 配列に入っている全要素に対して順番に処理を適用
  this.elements.forEach((el) => el.classList.add(...classNames));
  return this;
}
```

#### 理由 3: 要素が「0 件」のときの Null エラーを防ぐため

要素を単一の element: T | null で保持する設計にした場合、指定した要素がページ内に存在しないと null が入ります。その結果、メソッドを実行するたびに呼び出し側や内部で null チェックが必要になります。
一方、配列（T[]）で保持する設計であれば、見つからない場合は単に 「空の配列 []」 になるだけです。

```ts
// 存在しないセレクタを指定した場合
const $empty = $('.not-found'); // elements は [] (空配列)

// 空配列に対して forEach を実行してもエラーにならず単にスルーされる
$empty.addClass('active'); // エラーにならない！
```
