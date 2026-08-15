import { MiniJQuery } from '../core';

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    css(property: Partial<CSSStyleDeclaration>): this;
    css(propertyName: keyof CSSStyleDeclaration): string;
    css(propertyName: keyof CSSStyleDeclaration, value: string): this;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.css = function <T extends HTMLElement>(
  this: MiniJQuery<T>,
  propOrName: keyof CSSStyleDeclaration | Partial<CSSStyleDeclaration>,
  value?: string
): any {
  // オブジェクト指定の場合: .css({ color: 'red', fontSize: '16px' })
  if (typeof propOrName === 'object') {
    this.elements.forEach((el) => {
      Object.assign(el.style, propOrName);
    });
    return this;
  }

  // Setter の場合: .css('color', 'red')
  if (value !== undefined) {
    this.elements.forEach((el) => {
      el.style[propOrName as any] = value;
    });
    return this;
  }

  // Getter の場合: .css('color')
  const first = this.elements[0];
  return first ? getComputedStyle(first)[propOrName as any] : '';
};
