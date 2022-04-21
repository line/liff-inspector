import Protocol from 'devtools-protocol';
import { randomNumId } from '../../utils';

export class Response implements Protocol.Network.Response {
  url: string;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  mimeType: string;
  connectionReused = false;
  connectionId: number;
  encodedDataLength: number;
  securityState = 'secure' as const;

  constructor({
    url,
    status,
    statusText,
    headers,
    mimeType,
    encodedDataLength,
  }: {
    url: string;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    mimeType: string;
    encodedDataLength: number;
  }) {
    this.url = url;
    this.status = status;
    this.statusText = statusText;
    this.headers = headers;
    this.mimeType = mimeType;
    this.encodedDataLength = encodedDataLength;

    this.connectionId = randomNumId();
  }
}
