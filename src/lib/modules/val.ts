import { MiniJQuery } from '../core';

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    val(): string;
    val(value: string): this;
  }
}

// フォーム要素かどうか判定する型ガード関数
function isFormElement(
  el: HTMLElement
): el is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement
  );
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.val = function (this: MiniJQuery, value?: string): any {
  if (value !== undefined) {
    this.elements.forEach((el) => {
      if (isFormElement(el)) {
        el.value = value;
      }
    });
    return this;
  }

  const first = this.elements[0];
  if (isFormElement(first)) {
    return first.value;
  }

  return '';
};
