import { MiniJQuery } from '../core';

// $('p').append('太郎さん。');
// $("ul").append(li)
// $('div').append('<div id="one">', '<div id="two">');
// $('div').append(div1, div2);

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    append(
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
MiniJQuery.prototype.append = function (
  this: MiniJQuery,
  content:
    | string
    | HTMLElement
    | HTMLElement[]
    | NodeListOf<HTMLElement>
    | MiniJQuery<HTMLElement>
): any {
  this.elements.forEach((parent, parentIndex) => {
    // 1. 文字列の場合は insertAdjacentHTML で追加
    if (typeof content === 'string') {
      parent.insertAdjacentHTML('beforeend', content);
    }
    // 2. 生 DOM の場合
    else if (content instanceof HTMLElement) {
      const node = parentIndex === 0 ? content : content.cloneNode(true);
      parent.appendChild(node);
    }
    // 3. 配列、NodeList、MiniJQuery インスタンスの場合
    else {
      const nodes =
        content instanceof MiniJQuery ? content.elements : Array.from(content);

      nodes.forEach((node) => {
        const nodeToAppend = parentIndex === 0 ? node : node.cloneNode(true);
        parent.appendChild(nodeToAppend);
      });
    }
  });

  return this;
};
