import { MiniJQuery } from '../core';

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    siblings(selector?: string): MiniJQuery<HTMLElement>;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.siblings = function (
  this: MiniJQuery,
  selector?: string
): any {
  const siblingElements: HTMLElement[] = [];

  this.elements.forEach((el) => {
    const parent = el.parentElement;

    if (parent) {
      Array.from(parent.children).forEach((child) => {
        if (
          child !== el &&
          child instanceof HTMLElement &&
          !siblingElements.includes(child) &&
          (!selector || child.matches(selector))
        ) {
          siblingElements.push(child);
        }
      });
    }
  });

  return new MiniJQuery(siblingElements);
};
