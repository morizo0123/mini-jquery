import { MiniJQuery } from '../core';

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    empty(): this;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.empty = function (this: MiniJQuery): any {
  this.elements.forEach((el) => {
    // 1. 子要素をすべて取得し、それぞれに登録されているイベントを off() で全解除
    const children = document.querySelectorAll('*');
    children.forEach((child) => {
      if (child instanceof HTMLElement) {
        new MiniJQuery([child]).off();
      }
    });

    // 2. 自身に登録されているイベントも解除したい場合は off() を実行
    // new MiniJQuery([el]).off();

    // 3. 最後に DOM をクリア
    el.textContent = '';
  });

  return this;
};
