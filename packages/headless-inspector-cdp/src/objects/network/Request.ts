import Protocol from 'devtools-protocol';

export class Request implements Protocol.Network.Request {
  url: string;
  urlFragment?: string;
  method: string;
  headers: Record<string, string>;
  postData?: string;
  hasPostData?: boolean;
  postDataEntries?: { bytes?: string }[];
  mixedContentType?: Protocol.Security.MixedContentType;
  initialPriority: Protocol.Network.ResourcePriority;
  referrerPolicy:
    | 'unsafe-url'
    | 'no-referrer-when-downgrade'
    | 'no-referrer'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin';
  isLinkPreload?: boolean;
  //   trustTokenParams?: TrustTokenParams;
  isSameSite?: boolean;

  constructor({
    url,
    method,
    headers,
    postData,
    hasPostData,
    mixedContentType,
    initialPriority,
    referrerPolicy,
    isLinkPreload,
    isSameSite,
  }: Protocol.Network.Request) {
    const urlObj = new URL(url);
    this.url = url;
    this.urlFragment = urlObj.hash;
    this.method = method;
    this.headers = headers;
    this.postData = postData;
    this.hasPostData = hasPostData;
    this.mixedContentType = mixedContentType;
    this.initialPriority = initialPriority;
    this.referrerPolicy = referrerPolicy;
    this.isLinkPreload = isLinkPreload;
    this.isSameSite = isSameSite;
  }
}
