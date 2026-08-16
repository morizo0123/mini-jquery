import { MiniJQuery } from '../core';

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    // パターン1: オブジェクト渡しによる一括設定（Setter）
    attr(attributes: Record<string, string | number | boolean>): this;
    // パターン2: 属性名の取得（Getter）
    attr(name: string): string;
    // パターン3: 単一の属性の設定（Setter）
    attr(name: string, value: string): this;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.attr = function (
  this: MiniJQuery,
  nameOrAttrs: string | Record<string, string | number | boolean>,
  value?: string | number | boolean
): any {
  // 1 オブジェクトが渡された場合
  if (typeof nameOrAttrs === 'object' && nameOrAttrs !== null) {
    this.elements.forEach((el) => {
      Object.entries(nameOrAttrs).forEach(([key, val]) => {
        if (val === false || val === null || val === undefined) {
          el.removeAttribute(key); // boolean の false などは属性自体を削除
        } else {
          el.setAttribute(key, String(val));
        }
      });
    });
    return this;
  }

  // ★ ここに到達した時点で nameOrAttrs は絶対 string！
  // 別の変数に代入することで、TS に「これは string です」と完全に確定させる
  const attrName = nameOrAttrs;

  // 2 単一の Setter (例: .attr('disabled', true))
  if (value !== undefined) {
    this.elements.forEach((el) => {
      if (value === false || value === null) {
        el.removeAttribute(attrName);
      } else {
        el.setAttribute(attrName, String(value));
      }
    });
    return this;
  }

  // 3 Getter (例: .attr('id'))
  const first = this.elements[0];
  return first ? first.getAttribute(attrName) : null;
};
