const px = (n = 0): string => `${n}px`;

const h = <K extends keyof HTMLElementTagNameMap>(
  id: string | null,
  tag: K,
  style: Partial<CSSStyleDeclaration>
): HTMLElementTagNameMap[K] => {
  const dom = document.createElement(tag);
  if (id) {
    dom.id = id;
  }
  Object.entries(style).forEach(([key, value]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dom.style[key as any] = value as any;
  });
  return dom;
};

const HIGHLIGHT_CONTAINER_ID = 'HIGHLIGHT_CONTAINER_ID';

export class Highlight {
  node: HTMLDivElement;

  constructor(append: (el: HTMLDivElement) => void) {
    this.node = h(HIGHLIGHT_CONTAINER_ID, 'div', {
      display: 'none',
      position: 'absolute',
    });
    append(this.node);
  }

  hide() {
    this.node.style.display = 'none';
  }

  show(target: Element, { contentColor }: { contentColor: string }) {
    const rect = target.getBoundingClientRect();
    this.node.style.backgroundColor = contentColor;
    this.node.style.width = px(rect.width);
    this.node.style.height = px(rect.height);
    this.node.style.left = px(rect.left);
    this.node.style.top = px(rect.top);
    this.node.style.display = 'block';
  }
}
