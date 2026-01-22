export interface StreamPayload {
  stream: NodeJS.ReadableStream;
  start: number;
  end: number;
  size: number;
  contentType: string;
}
