import { MiniJQuery } from '../core';

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    parent(selector?: string): MiniJQuery<HTMLElement>;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.parent = function (
  this: MiniJQuery,
  selector?: string
): any {
  const parentElements: HTMLElement[] = [];

  this.elements.forEach((el) => {
    const parent = el.parentElement;

    if (parent) {
      if (!selector || parent.matches(selector)) {
        if (!parentElements.includes(parent)) {
          parentElements.push(parent);
        }
      }
    }
  });

  return new MiniJQuery(parentElements);
};
