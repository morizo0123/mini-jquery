export class MiniJQuery<T extends HTMLElement = HTMLElement> {
  readonly elements: T[];

  constructor(elements: T[]) {
    this.elements = elements;
  }

  // クラスの追加
  addClass(...classNames: string[]): this {
    this.elements.forEach((el) => el.classList.add(...classNames));
    return this;
  }

  // クラスの削除
  removeClass(...classNames: string[]): this {
    this.elements.forEach((el) => el.classList.remove(...classNames));
    return this;
  }

  // テキストの変更・取得
  text(): string;
  text(value: string): this;
  text(value?: string): string | this {
    if (value !== undefined) {
      this.elements.forEach((el) => (el.textContent = value));
      return this;
    }
    return this.elements[0]?.textContent ?? '';
  }

  // イベントハンドラ
  on<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: T, ev: HTMLElementEventMap[K]) => void
  ): this {
    this.elements.forEach((el) => {
      el.addEventListener(type, listener as EventListener);
    });
    return this;
  }
}

export interface MiniJQuery<T extends HTMLElement = HTMLElement> {
  // 後から別ファイルで型を拡張（Declaration Merging）するための空インターフェース宣言
}
