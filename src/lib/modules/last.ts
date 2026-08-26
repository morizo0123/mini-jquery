import { MiniJQuery } from '../core';

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    last(): MiniJQuery<HTMLElement>;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.last = function (this: MiniJQuery): any {
  const last = this.elements[this.elements.length - 1];
  const lastElements = last ? [last] : [];

  return new MiniJQuery(lastElements);
};
