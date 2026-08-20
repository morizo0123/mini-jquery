import { MiniJQuery } from '../core';

// $('li').eq(2).css('color', 'red');
// $('div').eq(-1).addClass('end');

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    eq(index: number): MiniJQuery<T>;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.eq = function <T extends HTMLElement>(
  this: MiniJQuery<T>,
  index: number
): MiniJQuery<T> {
  // 1. Array.prototype.at() を使って指定インデックスの要素を1つ取得 (負の数にも対応)
  const element = this.elements.at(index);

  // 2. 要素が存在すれば [element]、存在しなければ空配列 [] を渡して「新しい MiniJQuery」を作る
  const newElements = element ? [element] : [];

  // 3. 新しい MiniJQuery インスタンスとして返却する
  return new MiniJQuery(newElements);
};
