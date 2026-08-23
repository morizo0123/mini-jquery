import { MiniJQuery } from '../core';

// $('div').children().css('color','red');
// $("#c").children("#c_1").css("color","red");
// $(".box").children("div")

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    // 引数なし、または CSS セレクタ指定で直下の子要素を取得する
    children(selector?: string): MiniJQuery<HTMLElement>;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.children = function (
  this: MiniJQuery,
  selector?: string
): any {
  const childElements: HTMLElement[] = [];

  this.elements.forEach((parent) => {
    // 1. 直下の子要素一覧 (HTMLCollection) を配列に変換してループ
    Array.from(parent.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        // 2. セレクタが指定されている場合は matches() で絞り込む
        if (selector) {
          if (child.matches(selector) && !childElements.includes(child)) {
            childElements.push(child);
          }
        } else {
          // セレクタ指定がなければそのまま追加（重複防止付き）
          if (!childElements.includes(child)) {
            childElements.push(child);
          }
        }
      }
    });
  });

  // 3. 子要素を保持した「新しい MiniJQuery インスタンス」を返す
  return new MiniJQuery(childElements);
};
