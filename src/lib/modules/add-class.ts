import { MiniJQuery } from '../core';

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    addClass(...classNames: string[]): this;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.addClass = function (
  this: MiniJQuery,
  ...classNames: string[]
): any {
  this.elements.forEach((el) => {
    el.classList.add(...classNames);
  });
  return this;
};
