import { MiniJQuery } from '../core';

// $('body').html('こんにちは！');
// $('body').html('<h1>こんにちは！</h1>');
// const result1 = $('p').html();
// const result2 = $('a').html();

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    // 1. Getter: 先頭要素の innerHTML を取得（要素がなければ undefined）
    html(): string | undefined;
    // 2. Setter: 文字列、生DOM、または MiniJQuery インスタンスをセット
    html(content: string | HTMLElement | MiniJQuery<HTMLElement>): this;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.html = function (
  this: MiniJQuery,
  content?: string | HTMLElement | MiniJQuery
): any {
  // ■ Getter (引数がない場合)
  if (content === undefined) {
    const first = this.elements[0];
    return first ? first.innerHTML : undefined;
  }

  // ■ Setter (引数がある場合)
  this.elements.forEach((el) => {
    // 1. 文字列が渡された場合
    if (typeof content === 'string') {
      el.innerHTML = content;
    }
    // 2. 生の HTMLElement が渡された場合
    else if (content instanceof HTMLElement) {
      el.innerHTML = '';
      el.appendChild(content.cloneNode(true)); // 複数要素に対応するためクローンを追加
    }
    // 3. MiniJQuery インスタンスが渡された場合
    else if (content instanceof MiniJQuery) {
      el.innerHTML = '';
      content.elements.forEach((child) => {
        el.appendChild(child.cloneNode(true));
      });
    }
  });

  return this;
};
