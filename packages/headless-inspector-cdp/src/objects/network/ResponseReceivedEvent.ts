import Protocol from 'devtools-protocol';
import { Response } from './Response';

export class ResponseReceivedEvent
  implements Protocol.Network.ResponseReceivedEvent
{
  requestId: string;
  loaderId: string;
  timestamp: number;
  response: Response;
  type: Protocol.Network.ResourceType;
  hasExtraInfo: boolean;

  constructor({
    requestId,
    loaderId,
    timestamp,
    type,
    response: { url, status, statusText, headers, length, mimeType },
  }: {
    requestId: string;
    loaderId: string;
    timestamp: number;
    type: Protocol.Network.ResourceType;
    response: {
      url: string;
      status: number;
      statusText: string;
      headers: Record<string, string>;
      length: number;
      mimeType?: string;
    };
  }) {
    this.requestId = requestId;
    this.loaderId = loaderId;
    this.timestamp = timestamp;
    this.response = new Response({
      url,
      status,
      statusText,
      headers,
      encodedDataLength: length,
      mimeType: mimeType ?? 'text/html',
    });
    this.type = type;
    this.hasExtraInfo = false;
  }
}
