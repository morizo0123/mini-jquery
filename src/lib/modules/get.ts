import { MiniJQuery } from '../core';

// 1番目（インデックス0）のDOM要素を取り出す
// var element = $('div').get(0);

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    get(): T[];
    get(index: number): T | undefined;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.get = function <T extends HTMLElement>(
  this: MiniJQuery<T>,
  index?: number
): T[] | T | undefined {
  // 1. 引数が指定されていない場合は、生の DOM 配列をそのまま返す
  if (index === undefined) {
    return this.elements;
  }

  // 2. index が指定されている場合は Array.prototype.at() で 1 つ取り出して返す
  //    (負の数 -1 にも対応。範囲外なら undefined が返る)
  return this.elements.at(index);
};
