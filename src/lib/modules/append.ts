import { MiniJQuery } from '../core';

// $('p').append('太郎さん。');
// $("ul").append(li)
// $('div').append('<div id="one">', '<div id="two">');
// $('div').append(div1, div2);

// ① 文字列を入れるための透明なバケツを作る
// const template = document.createElement('template');
// ② 文字列を流し込む（ブラウザが自動で DOM ノード構造に変換してくれる）
// template.innerHTML = '<p>Hello</p>';
// ③ 変換された DOM ノード（<p>Hello</p>）を取り出して appendChild に渡す！
// const nodes = template.content.childNodes;

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
  // 1. 渡された content を配列 (Node[]) に正規化する
  let nodesToAppend: Node[] = [];

  if (typeof content === 'string') {
    // HTML 文字列の場合: template タグを使って DOM ノード化する
    const template = document.createElement('template');
    template.innerHTML = content.trim();
    nodesToAppend = Array.from(template.content.childNodes);
  } else if (content instanceof HTMLElement) {
    nodesToAppend = [content];
  } else if (Array.isArray(content)) {
    nodesToAppend = content;
  } else if (content instanceof NodeList) {
    nodesToAppend = Array.from(content);
  } else if (content instanceof MiniJQuery) {
    nodesToAppend = content.elements;
  }

  // 2. 保持している各要素の末尾に追加する
  this.elements.forEach((parent, parentIndex) => {
    nodesToAppend.forEach((node) => {
      // 複数の親要素に append する場合、2つ目以降の親には cloneNode(true) で複製して追加する
      const nodeToAppend = parentIndex === 0 ? node : node.cloneNode(true);
      parent.appendChild(nodeToAppend);
    });
  });

  return this;
};
