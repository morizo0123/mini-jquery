import { MiniJQuery } from '../core';

// $('h1').fadeIn();
// $('h1').fadeIn(3000);

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    fadeIn(duration?: number): this;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.fadeIn = function (
  this: MiniJQuery,
  duration?: number
): any {
  this.elements.forEach((el) => {
    if (getComputedStyle(el).display === 'none') {
      el.style.display = '';
      el.style.opacity = '0';

      const animation = el.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration
      });

      animation.onfinish = () => {
        el.style.opacity = '';
      };
    }
  });

  return this;
};
