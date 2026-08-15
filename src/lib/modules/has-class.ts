import { MiniJQuery } from '../core';

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    hassClass(className: string): boolean;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.hassClass = function (
  this: MiniJQuery,
  className: string
): boolean {
  // 取得した要素のうち、1つでも指定のクラスを持っていれば true を返す
  return this.elements.some((el) => el.classList.contains(className));
};
