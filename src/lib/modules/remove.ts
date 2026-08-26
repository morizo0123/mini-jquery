import { MiniJQuery } from '../core';

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    remove(): this;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.remove = function (this: MiniJQuery): any {
  this.elements.forEach((el) => {
    // 1. 子要素と自身に登録されたイベントを解除（メモリリーク防止）
    new MiniJQuery([el]).empty(); // 子要素のイベント解除
    new MiniJQuery([el]).off(); // 自身のイベント解除

    // 2. DOM から要素を削除
    el.remove();
  });

  return this;
};
