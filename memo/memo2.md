# modules編

## src/modules/toggle-class.ts

スペース区切り（'a b'）のパース処理が必要な理由は、classList.toggle() や classList.add() はスペースが含まれた文字列をそのまま渡すとエラー（InvalidCharacterError）になるからです。

本家 jQuery では、以下のように 1 つの文字列の中にスペース区切りで複数のクラス を渡すことができます。

```ts
// スペース区切りで渡す呼び出し
$el.toggleClass('active open highlight');
```

しかし、DOM 標準の classList.toggle('active open') は スペース入りの引数を受け付けず、実行すると JavaScript の例外エラー（DOMException）が発生 します。

そのため、内部でスペースで分割して 'active'、'open'、'highlight' という 1つずつの単語（配列）に解体する 必要があります。

### 3 のコードで行っている処理の分解解説

```ts
const classNames: string[] = rawClassNames
  .flatMap((item) => (typeof item === 'string' ? item.trim().split(/\s+/) : []))
  .filter(Boolean);
```

ステップ 1: item.trim().split(/\s+/)（スペース区切りで分割）

- .trim(): 前後の余計な空白を削ります（例: ' a b ' ➔ 'a b'）。
- .split(/\s+/): 1つ以上の空白文字（スペースやタブ）で文字列を切り分け、配列にします。

```ts
// 例: item が 'active open' の場合
'active open'.trim().split(/\s+/) ➔ ['active', 'open']
```

ステップ 2: .flatMap(...)（配列の平坦化）
もし $el.toggleClass('a b', 'c') のように複数の引数が渡された場合、通常の .map() だと 配列の中に配列が入った二重構造 になってしまいます。

- .map() の場合: [['a', 'b'], ['c']] （二重配列）
- .flatMap() の場合: ['a', 'b', 'c'] （自動的に1つのフラットな配列に平坦化！）

flatMap を使うことで、どのような引数の渡され方をしても最終的に 「1次元の文字列配列（string[]）」 に揃えることができます。

ステップ 3: .filter(Boolean)（空文字の除去）
万が一 ''（空文字）などの不要な値が紛れ込んだ場合、それを配列から除去してきれいなクラス名だけを残します。

### 具体的な変換ロジックの動作例

渡された引数 rawClassNames が ['active open', ' highlight '] だった場合のデータの変化は以下の通りです。

```text
1. rawClassNames:
   ['active open', '  highlight  ']

2. flatMap 内で各要素を分割:
   'active open'  ➔ ['active', 'open']
   '  highlight ' ➔ ['highlight']

3. flatMap 適用後 (1つの配列に結合される):
   ['active', 'open', 'highlight']

4. filter(Boolean) 適用後:
   ['active', 'open', 'highlight']  ← これを forEach で1つずつ toggle() に渡す！
```
