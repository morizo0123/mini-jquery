import { MiniJQuery } from '../core';

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    text(): string;
    text(value: string): this;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.text = function (this: MiniJQuery, value?: string): any {
  if (value !== undefined) {
    this.elements.forEach((el) => {
      el.textContent = value;
    });
    return this;
  }
  // return this.elements[0]?.textContent ?? "";
  return this.elements.map((el) => el.textContent ?? '').join('');
};
