import { MiniJQuery } from '../core';

// $(セレクタ).prepend(追加するコンテンツ);
// $('p').prepend('太郎さん、');
// $('li').prepend('<strong>ユーザー名：</strong>');
// $('div').prepend('<h1>タイトル</h1>', '<p>テキスト</p>', '<a href="#">リンク</a>');

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    prepend(
      content:
        | string
        | HTMLElement
        | HTMLElement[]
        | NodeListOf<HTMLElement>
        | MiniJQuery<HTMLElement>
    ): this;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.prepend = function (
  this: MiniJQuery,
  content:
    | string
    | HTMLElement
    | HTMLElement[]
    | NodeListOf<HTMLElement>
    | MiniJQuery<HTMLElement>
): any {
  this.elements.forEach((parent, parentIndex) => {
    if (typeof content === 'string') {
      parent.insertAdjacentHTML('afterbegin', content);
      return;
    }

    // 挿入対象の Node 配列を作成する
    let nodesToPrepend: HTMLElement[] = [];

    if (content instanceof HTMLElement) {
      nodesToPrepend = [content];
    } else if (content instanceof MiniJQuery) {
      nodesToPrepend = content.elements;
    } else {
      nodesToPrepend = Array.from(content);
    }

    [...nodesToPrepend].reverse().forEach((node) => {
      const nodeToPrepend = parentIndex === 0 ? node : parent.cloneNode(true);
      parent.insertBefore(nodeToPrepend, parent.firstChild);
    });
  });

  return this;
};
