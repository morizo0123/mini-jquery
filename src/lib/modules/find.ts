import { MiniJQuery } from '../core';

// $(親要素).find('検索条件');
// 例：.container の中にあるすべての p タグを探す
// $('.container').find('p').css('color', 'red');

// クラス名で探す
// $('#parent').find('.child-class');
// ID名で探す
// $('#parent').find('#target-id');
// カンマで区切る
// $('.wrapper').find('span, p');

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    // パターン 1: HTMLタグ名で検索（例: $el.find('button') -> MiniJQuery<HTMLButtonElement>）
    find<K extends keyof HTMLElementTagNameMap>(
      selector: K
    ): MiniJQuery<HTMLElementTagNameMap[K]>;

    // パターン 2: 一般的な CSS セレクタで検索（例: $el.find('.active') -> MiniJQuery<HTMLElement>）
    find<E extends HTMLElement = HTMLElement>(selector: string): MiniJQuery<E>;

    // パターン 3: 生の HTMLElement または MiniJQuery インスタンスを子要素から探す場合
    find(
      element: HTMLElement | MiniJQuery<HTMLElement>
    ): MiniJQuery<HTMLElement>;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.find = function (
  this: MiniJQuery,
  selectorOrElement: string | HTMLElement | MiniJQuery<HTMLElement>
): MiniJQuery<any> {
  // ① 見つかった子要素を一時的に全部ためておく「配列」を用意する
  const foundElements: HTMLElement[] = [];

  // 1. セレクタ文字列の場合
  if (typeof selectorOrElement === 'string') {
    this.elements.forEach((parent) => {
      const nodes = parent.querySelectorAll(selectorOrElement);
      nodes.forEach((node) => {
        if (node instanceof HTMLElement && !foundElements.includes(node)) {
          foundElements.push(node);
        }
      });
    });
  }
  // 2. 生の DOM 要素の場合
  else if (selectorOrElement instanceof HTMLElement) {
    this.elements.forEach((parent) => {
      if (parent.contains(selectorOrElement) && parent !== selectorOrElement) {
        foundElements.push(selectorOrElement);
      }
    });
  }
  // 3. MiniJQuery インスタンスの場合
  else if (selectorOrElement instanceof MiniJQuery) {
    selectorOrElement.elements.forEach((child) => {
      this.elements.forEach((parent) => {
        if (
          parent.contains(child) &&
          parent !== child &&
          !foundElements.includes(child)
        ) {
          foundElements.push(child);
        }
      });
    });
  }

  // ★ ポイント: this ではなく、検索結果の要素を持った「新しい MiniJQuery」を返す！
  return new MiniJQuery(foundElements);
};
