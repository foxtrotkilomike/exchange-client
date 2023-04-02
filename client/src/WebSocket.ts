import { WSEvent } from './Config/Enums';
import MessageEvent from './MessageEvent';
import Server from './Server';
import MessageEventT from './Types/MessageEvent';

export default class WebSocket extends EventTarget {
  private _url: string;
  private _protocol: string;
  private _server: Server;

  constructor(url: string, protocol?: string) {
    super();
    this._server = new Server(this);
    this._url = url;
    this._protocol = protocol || 'ws';
  }

  onopen = (cb: () => void) => {
    this._server.addEventListener(WSEvent.open, cb);
  };

  onclose = (cb: () => void) => {
    this._server.addEventListener(WSEvent.close, cb);
  };

  onmessage = (cb: (event: MessageEventT) => void) => {
    this._server.addEventListener(WSEvent.message, (e) => {
      if (e.hasOwnProperty('data')) {
        cb(e as MessageEventT);
      }
    });
  };

  onerror = (cb: () => void) => {
    this._server.addEventListener(WSEvent.error, cb);
  };

  close = () => {
    this.dispatchEvent(new Event(WSEvent.close));
  };

  send = (data: string) => {
    this.dispatchEvent(new MessageEvent<string>(WSEvent.message, data));
  };
}
