import { MiniJQuery } from '../core';

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    first(): MiniJQuery<HTMLElement>;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.first = function (this: MiniJQuery): any {
  const first = this.elements[0];
  const firstElements = first ? [first] : [];

  return new MiniJQuery(firstElements);
};
