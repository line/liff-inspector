import Protocol from 'devtools-protocol';
import { Initiator } from './Initiator';
import { Request } from './Request';

export class RequestWillBeSentEvent
  implements Protocol.Network.RequestWillBeSentEvent
{
  requestId: string;
  loaderId: string;
  documentURL: string;
  request: Request;
  timestamp: number;
  wallTime: number;
  initiator: Initiator;
  redirectHasExtraInfo: boolean;
  //   redirectResponse?: Response;
  type?: Protocol.Network.ResourceType;
  frameId?: string;
  hasUserGesture?: boolean;

  constructor({
    requestId,
    documentURL,
    request,
    timestamp,
    type,
  }: {
    requestId: string;
    documentURL: string;
    request: {
      url: string;
      method: string;
      headers: Record<string, string>;
    };
    timestamp: number;
    type?: Protocol.Network.ResourceType;
  }) {
    this.requestId = requestId;
    this.loaderId = requestId; // FIXME
    this.documentURL = documentURL;
    this.request = new Request({
      url: request.url,
      method: request.method,
      headers: request.headers,
      initialPriority: 'High', // FIXME
      referrerPolicy: 'origin', // FIXME
    });
    this.timestamp = timestamp; // FIXME
    this.wallTime = timestamp; // FIXME
    this.initiator = new Initiator({ type: 'other' });
    this.redirectHasExtraInfo = false;
    this.type = type;
  }
}
