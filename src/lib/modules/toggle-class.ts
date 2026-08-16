import { MiniJQuery } from '../core';

// ① 型の拡張 (Declaration Merging)
declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    // パターン1: 複数のクラス名をまとめてトグル ($el.toggleClass('active', 'open'))
    toggleClass(...classNames: string[]): this;
    // パターン2: クラス名と、強制切り替えフラグ ($el.toggleClass('active', true))
    toggleClass(className: string, state?: boolean): this;
  }
}

// ② 実装（プロトタイプへの追加）
MiniJQuery.prototype.toggleClass = function (
  this: MiniJQuery,
  ...args: any[]
): any {
  // 1. 最後の引数が boolean かどうかチェック
  const lastArg = args[args.length - 1];
  const hasState = typeof lastArg === 'boolean';
  const state = hasState ? (lastArg as boolean) : undefined;

  // 2. boolean を除いた「クラス名が入っている部分」を取り出す
  const rawClassNames = hasState ? args.slice(0, -1) : args;

  // 3. ここでスペース区切り（'a b'）もパースしてバラバラの配列にする！
  const classNames: string[] = rawClassNames
    .flatMap((item) =>
      typeof item === 'string' ? item.trim().split(/\s+/) : []
    )
    .filter(Boolean);

  this.elements.forEach((el) => {
    classNames.forEach((className) => {
      if (hasState) {
        // state (boolean) が指定されている場合
        el.classList.toggle(className, state);
      } else {
        // state が指定されていない場合（通常のトグル）
        el.classList.toggle(className);
      }
    });
  });

  return this;
};
