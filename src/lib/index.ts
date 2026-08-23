import { MiniJQuery } from './core';
import './modules/css';
import './modules/add-class';
import './modules/remove-class';
import './modules/has-class';
import './modules/val';
import './modules/attr';
import './modules/text';
import './modules/toggle-class';
import './modules/show-hide';
import './modules/eq';
import './modules/append';
import './modules/children';
import './modules/html';

// $ 関数のオーバーロード定義
// 1. タグ名指定: $('button') -> MiniJQuery<HTMLButtonElement>
export function $<K extends keyof HTMLElementTagNameMap>(
  selector: K
): MiniJQuery<HTMLElementTagNameMap[K]>;

// 2. セレクタ指定: $('.my-class') -> MiniJQuery<HTMLElement>
export function $<T extends HTMLElement = HTMLElement>(
  selector: string
): MiniJQuery<T>;

// 3. 生の DOM 要素指定: $(document.getElementById('app'))
export function $<T extends HTMLElement>(element: T | null): MiniJQuery<T>;

// $ 関数の実装
export function $(selectorOrElement: string | HTMLElement): MiniJQuery {
  if (selectorOrElement === null) {
    return new MiniJQuery([]);
  }

  if (typeof selectorOrElement === 'string') {
    const nodes = Array.from(document.querySelectorAll(selectorOrElement));
    return new MiniJQuery(nodes as HTMLElement[]);
  }

  return new MiniJQuery([selectorOrElement]);
}

export { MiniJQuery };
