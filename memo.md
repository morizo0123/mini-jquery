# 自作 jQuery: イベント管理（event.ts）の仕組みと型定義メモ

JavaScript/TypeScript における DOM イベント処理（`on` / `off`）の実装仕様と、メモリリーク防止の仕組みについての解説まとめ。

---

## なぜイベント管理モジュール（event.ts）が必要なのか？

### `removeEventListener` の「参照（Reference）」問題

JavaScript の standard DOM API である `removeEventListener` には、**「登録時と全く同じ関数オブジェクト（同じメモリ空間・住所）を渡さなければ削除されない」** という厳格な仕様がある。

```typescript
// ❌ 削除されない例（見た目が同じでも、実行時に別々の関数オブジェクトが生成されるため）
button.addEventListener('click', () => {
  alert('Hi');
});
button.removeEventListener('click', () => {
  alert('Hi');
});

// ⭕ 削除される例（変数に入れて同じ参照を渡す）
const handler = () => {
  alert('Hi');
};
button.addEventListener('click', handler);
button.removeEventListener('click', handler);
```

## たった 1 つのアイデア：「要素自身にメモ帳を貼る」

そこで events.ts では、「DOM要素自体にメモ欄を作って、登録した関数を記録しておく」 という作戦をとっています。

```
【DOM要素 (例: <button>)】
┌──────────────────────────────────────┐
│ id: "btn"                            │
│ innerText: "送信"                    │
│                                     │
│ 📋 秘密のメモ帳 (LISTENERS_KEY)       │
│  - click イベント: 関数A              │
│  - mouseover イベント: 関数B          │
└──────────────────────────────────────┘
```

## コードの流れを 1 つずつ紐解く

① 秘密のメモ帳の「名前」を決める (Symbol)

```ts
const LISTENERS_KEY = Symbol('listeners');
```

他のプログラムが偶然使うプロパティ名（例: listeners）と被って壊れないように、「絶対に被らない特別な鍵（Symbol）」 を作っています。

## on() ＝ メモ帳に書き留めてからイベント登録

```ts
MiniJQuery.prototype.on = function (type: string, listener: EventListener) {
  this.elements.forEach((el) => {
    // 1. 本物のイベントを登録する
    el.addEventListener(type, listener);

    // 2. まだメモ帳がなければ、空のノート（配列）を作る
    if (!el[LISTENERS_KEY]) {
      el[LISTENERS_KEY] = [];
    }

    // 3. メモ帳に「何のイベント(type)」に「どの関数(listener)」を登録したか記録する！
    el[LISTENERS_KEY].push({ type, listener });
  });

  return this;
};
```

## off() ＝ メモ帳を見て本物のイベントを解除する

```ts
MiniJQuery.prototype.off = function (type?: string, listener?: EventListener) {
  this.elements.forEach((el) => {
    // メモ帳を取り出す（メモがなければ何もしない）
    const storage = el[LISTENERS_KEY];
    if (!storage) return;

    // メモ帳に書いてあるリストを 1 つずつチェック
    el[LISTENERS_KEY] = storage.filter((item) => {
      // 消したい条件に合致するか？
      const typeMatch = !type || item.type === type;
      const listenerMatch = !listener || item.listener === listener;

      if (typeMatch && listenerMatch) {
        // ★ ここ！ メモしておいた「本物の関数(item.listener)」を使って削除！
        el.removeEventListener(item.type, item.listener);
        return false; // メモ帳からも消す
      }
      return true; // 消さないものはメモ帳に残す
    });
  });

  return this;
};
```

---

## off() メソッドに渡された引数のパターン（ワイルドカード処理） を判定するためのテクニック

本家 jQuery の off() は、引数の渡し方によって 「特定の関数だけ消す」「そのイベント全部消す」「全イベント消す」 という柔軟な使い分けができます。

```ts
$el.off('click', myFunc); // 1. click の myFunc だけ消す
$el.off('click'); // 2. click イベントを全部消す（関数問わず）
$el.off(); // 3. 登録されているイベントを全部消す
```

この「引数が渡されなかった場合（undefined）」に対応するために、!type や !listener を使っています。

### 1. 条件式の仕組み

```ts
const typeMatch = !type || item.type === type;
```

- !type ➔ type が渡されなかった（undefined）場合。「イベント名は何でも OK（マッチしたとみなす）」
- item.type === type ➔ 指定されたイベント名（例: 'click'）と、メモしてあるイベント名が一致した場合。

```ts
const listenerMatch = !listener || item.listener === listener;
```

- !listener ➔ listener（関数）が渡されなかった場合。「どの関数でも OK（マッチしたとみなす）」
- item.listener === listener ➔ 指定された関数と、メモしてある関数が一致した場合。

### 2. 3つのパターンで実際にどう評価されるか？

メモ帳に以下のデータが残っているとします。

```ts
item ➔ { type: 'click', listener: myFunc }
```

パターン A： $el.off('click', myFunc)（両方指定）

```ts
const typeMatch = !'click' || 'click' === 'click'; // false || true  => true
const listenerMatch = !myFunc || myFunc === myFunc; // false || true  => true
```

パターン B： $el.off('click')（イベント名だけ指定）

```ts
const typeMatch     = !'click'     || 'click' === 'click'; // false || true => true
const listenerMatch = !undefined   || ... ;                // true ! （ここで確定）
```

パターン C： $el.off()（引数なし＝全削除）

```ts
const typeMatch     = !undefined || ... ; // true ! （ここで確定）
const listenerMatch = !undefined || ... ; // true ! （ここで確定）
```

まとめ

```ts
// 「引数で指定されていない(すべてOK)」 OR 「指定された値とぴったり一致する」
const typeMatch = !type || item.type === type;
const listenerMatch = !listener || item.listener === listener;
```

||（論理和・OR演算子）は、「左右のどちらか一方でも true であれば、全体として true になる」
というルールを持っているからです。

---

## 関数型を指定したい場合、主に次の 3 パターンがあります。

TypeScript で「関数」であることを指定したい場合は、以下のいずれかの書き方をする必要があります。

パターン A： EventListener（本家 DOM 標準の型）★おすすめ

```ts
interface EventStorage {
  type: string;
  listener: EventListener;
}
```

- 解説: Web ブラウザ標準（DOM）で用意されている公式の型です。
- 中身: 実質的には (evt: Event) => void と同じ意味になります。addEventListener や removeEventListener の引数の型とピッタリ一致するため、一番安全です。

パターン B： (e: Event) => void（自作の関数の型）

```ts
interface EventStorage {
  type: string;
  listener: (e: Event) => void;
}
```

EventListener: DOM イベントの関数として 最も正確で安全な型
そのため、コード内では listener: EventListener と書かれています！
