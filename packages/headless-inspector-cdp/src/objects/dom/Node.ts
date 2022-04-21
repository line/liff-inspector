import Protocol from 'devtools-protocol';

export class CDPNode implements Protocol.DOM.Node {
  nodeId: number;
  parentId?: number;
  backendNodeId: number;
  nodeType: number;
  nodeName: string;
  localName: string;
  nodeValue: string;
  childNodeCount?: number;
  children?: CDPNode[];
  attributes?: string[];
  //   documentURL?: string;
  //   baseURL?: string;
  //   publicId?: string;
  //   systemId?: string;
  //   internalSubset?: string;
  //   xmlVersion?: string;
  //   name?: string;
  //   value?: string;
  //   pseudoType?: PseudoType;
  //   shadowRootType?: ShadowRootType;
  //   frameId?: Page.FrameId;
  //   contentDocument?: Node;
  //   shadowRoots?: Node[];
  //   templateContent?: Node;
  //   pseudoElements?: Node[];
  //   importedDocument?: Node;
  //   distributedNodes?: BackendNode[];
  //   isSVG?: boolean;
  //   compatibilityMode?: CompatibilityMode;

  constructor({
    node,
    nodeId,
    parentId,
    childNodeCount = 0,
    children = [],
  }: {
    nodeId: number;
    parentId?: number;
    node: Node | ChildNode;
    childNodeCount?: number;
    children?: CDPNode[];
  }) {
    this.nodeId = nodeId;
    this.parentId = parentId;
    this.backendNodeId = nodeId;
    this.nodeType = node.nodeType;
    this.nodeName = node.nodeName;
    this.localName = node.nodeName.toLowerCase();
    this.nodeValue = node.nodeValue ?? '';
    this.childNodeCount =
      childNodeCount > 0 ? childNodeCount : children?.length;
    this.children = children.length > 0 ? children : undefined;
    this.attributes = getAttributes(node);
  }
}

export const getAttributes = (node: Node | ChildNode): string[] => {
  const attributes: string[] = [];
  if (node instanceof Element) {
    const attributesMap = node.attributes;
    for (let i = 0; i < attributesMap.length; i++) {
      const attr = attributesMap.item(i);
      if (attr) {
        attributes.push(attr.name);
        attributes.push(attr.value);
      }
    }
  }
  return attributes;
};
