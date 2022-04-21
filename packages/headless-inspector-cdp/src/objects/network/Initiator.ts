import Protocol from 'devtools-protocol';

export class Initiator implements Protocol.Network.Initiator {
  type:
    | 'parser'
    | 'script'
    | 'preload'
    | 'SignedExchange'
    | 'preflight'
    | 'other';
  //   stack?: Runtime.StackTrace;
  url?: string;
  lineNumber?: number;
  columnNumber?: number;
  requestId?: string;

  constructor({
    type,
    url,
    lineNumber,
    columnNumber,
    requestId,
  }: Protocol.Network.Initiator) {
    this.type = type;
    this.url = url;
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;
    this.requestId = requestId;
  }
}
