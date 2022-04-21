import { Highlight } from '../highlight';
import { CDPNode } from '../objects/dom/Node';
import { Store } from '../store/Store';
import { CdpConverter } from '../types';
import { randomNumId } from '../utils';

// WIP
const toNodeArray = (nodes: NodeListOf<ChildNode>) =>
  Array.from(nodes).filter(
    (n) => !(n.nodeName === '#text' && n.nodeValue?.trim() === '')
  );

const store = new Store<number, Node>();

const recursiveBuildDOMNode = (
  node: Node,
  parentId: number | undefined,
  deps: number
): CDPNode => {
  const nodeId = randomNumId();
  if (!store.getById(nodeId)) {
    store.store(nodeId, node);
  }
  const childNodes = toNodeArray(node.childNodes);

  if (deps === 0) {
    const cdpNode = new CDPNode({
      node,
      nodeId,
      parentId,
      childNodeCount: childNodes.length,
    });
    return cdpNode;
  }

  const children = childNodes.map((child) => {
    const n = recursiveBuildDOMNode(child, nodeId, deps - 1);
    return n;
  });

  return new CDPNode({ nodeId, node, parentId, children });
};

export const attachDOMEvents: CdpConverter = (
  inspector,
  eventEmitter,
  setCommandHandler
) => {
  setCommandHandler('DOM.getDocument', () => {
    const rootNode = inspector.send('getRootNode', undefined);
    const root = recursiveBuildDOMNode(rootNode, undefined, 2);
    return { root };
  });

  setCommandHandler('DOM.requestChildNodes', ({ nodeId }) => {
    const node = store.getById(nodeId);
    if (!node) {
      return;
    }
    const children = toNodeArray(node.childNodes).map((child) =>
      recursiveBuildDOMNode(child, nodeId, 2)
    );
    eventEmitter.emit('DOM.setChildNodes', {
      parentId: nodeId,
      nodes: children,
    });
    return;
  });

  const highlight = new Highlight((el: HTMLDivElement) =>
    document.body.appendChild(el)
  );

  setCommandHandler('Overlay.hideHighlight', () => {
    highlight.hide();
  });

  setCommandHandler('Overlay.highlightNode', ({ nodeId, highlightConfig }) => {
    if (!nodeId) return;
    const node = store.getById(nodeId);
    if (!node || !(node instanceof Element)) return;

    const { contentColor } = highlightConfig;
    highlight.show(node, {
      contentColor: rgba(contentColor),
    });
  });
};

const rgba = (
  {
    r,
    g,
    b,
    a,
  }: {
    r: number;
    g: number;
    b: number;
    a?: number;
  } = { r: 0, g: 0, b: 0, a: 1 }
): string => {
  return `rgba(${r},${g},${b},${a})`;
};
