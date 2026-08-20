import { MiniJQuery } from '../core';

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    show(): this;
    hide(): this;
  }
}

// ② 実装（プロトタイプへの追加）
// show() の実装
MiniJQuery.prototype.show = function (this: MiniJQuery): any {
  this.elements.forEach((el) => {
    // 1. display が 'none' の場合だけ処理する
    if (getComputedStyle(el).display === 'none') {
      // 2. hide() した時に保存した元の display を復元
      const oldDisplay = el.dataset.oldDisplay;

      if (oldDisplay) {
        el.style.display = oldDisplay;
        delete el.dataset.oldDisplay; // 使い終わったら削除
      } else {
        // 保存された値がなければ style.display を空にして CSS のデフォルトに戻す
        el.style.display = '';

        // それでもなお none の場合（CSSで display: none が当たっている場合）は 'block' 等にする
        if (getComputedStyle(el).display === 'none') {
          el.style.display = 'block';
        }
      }
    }
  });

  return this;
};

// hide() の実装
MiniJQuery.prototype.hide = function (this: MiniJQuery): any {
  this.elements.forEach((el) => {
    // 1. 現在の display スタイルを取得
    const currentDisplay = getComputedStyle(el).display;

    // 2. none 以外なら、元の display を dataset に保存しておく
    if (currentDisplay !== 'none') {
      el.dataset.oldDisplay = currentDisplay;
    }

    // 3. 非表示にする
    el.style.display = 'none';
  });

  return this;
};
