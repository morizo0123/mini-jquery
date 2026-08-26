import { MiniJQuery } from '../core';

declare module '../core' {
  interface MiniJQuery<T extends HTMLElement> {
    on(type: string, listener: EventListener): this;
    off(type?: string, listener?: EventListener): this;
  }
}

// イベント情報を保持するための型（メモ帳の型）
interface EventStorage {
  type: string;
  listener: EventListener;
}

// Element にイベント記録用の領域を持たせる (Symbol などでも可)
const LISTENERS_KEY = Symbol('listeners');

type ElementWithListeners = HTMLElement & {
  [LISTENERS_KEY]?: EventStorage[];
};

// ■ on() の実装（登録時にリスナーを記憶する）
MiniJQuery.prototype.on = function (
  this: MiniJQuery,
  type: string,
  listener: EventListener
): any {
  this.elements.forEach((el: ElementWithListeners) => {
    // 1. イベントリスナーを標準 API で登録
    el.addEventListener(type, listener);

    // 2. 要素ごとの記録用配列を初期化
    if (!el[LISTENERS_KEY]) {
      el[LISTENERS_KEY] = [];
    }

    // 3. 削除できるように「イベント名」と「関数参照」を保存しておく
    el[LISTENERS_KEY].push({ type, listener });
  });

  return this;
};

// ■ off() の実装（特定、またはすべてのイベントを解除する）
MiniJQuery.prototype.off = function (
  this: MiniJQuery,
  type?: string,
  listener?: EventListener
): any {
  this.elements.forEach((el: ElementWithListeners) => {
    const storage = el[LISTENERS_KEY];
    if (!storage) return;

    // 記録から解除対象をループ処理
    el[LISTENERS_KEY] = storage.filter((item) => {
      // 引数の条件に合うか判定
      const typeMatch = !type || item.type === type;
      const listenerMatch = !listener || item.listener === listener;

      if (typeMatch && listenerMatch) {
        // 条件に合えば removeEventListener で解除！
        el.removeEventListener(item.type, item.listener);
        return false; // 記録配列から除外
      }
      return true; // 記録配列に残す
    });
  });

  return this;
};
