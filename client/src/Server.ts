import {
  ClientMessageType,
  OrderStatus,
  ServerMessageType,
  WSEvent,
} from './Config/Enums';
import MessageEvent from './MessageEvent';
import { ClientEnvelope } from './Models/ClientMessages';
import { ServerEnvelope } from './Models/ServerMessages';
import MessageEventT from './Types/MessageEvent';
import WebSocket from './WebSocket';

export default class Server extends EventTarget {
  private _ws: WebSocket;

  constructor(webSocket: WebSocket) {
    super();
    this._ws = webSocket;
    this._ws.addEventListener(WSEvent.message, (e) => {
      if (e.hasOwnProperty('data')) {
        this.onmessage(e as MessageEventT);
      }
    });
    this._ws.addEventListener(WSEvent.close, this.onclose);
    this.openConnection();
  }

  openConnection = () => {
    setTimeout(() => {
      this.dispatchEvent(new Event(WSEvent.open));
    }, 2000);
  };

  onmessage = (event: MessageEventT) => {
    const message: ClientEnvelope = JSON.parse(event.data);
    try {
      switch (message.messageType) {
        case ClientMessageType.subscribeMarketData:
          this.subscribeMarketData(message);
          break;
        case ClientMessageType.unsubscribeMarketData:
          this.unsubscribeMarketData(message);
          break;
        case ClientMessageType.placeOrder:
          this.placeOrder(message);
          break;
      }
    } catch (err) {
      console.error('Invalid message type or message data', err);
    }
  };

  onclose = () => {
    setTimeout(() => this.dispatchEvent(new Event(WSEvent.close)), 2000);
  };

  send = (message: ServerEnvelope) => {
    setTimeout(
      () => this.dispatchEvent(new MessageEvent(WSEvent.message, message)),
      2000,
    );
  };

  subscribeMarketData = (message: ClientEnvelope) => {
    console.log('Sever received subscribeMarketData', message.message);
    // setInterval with dispatchEvent of MarketDataUpdate message type
    this.send({
      messageType: ServerMessageType.success,
      message: { subscriptionId: 123 },
    });
  };

  unsubscribeMarketData = (message: ClientEnvelope) => {
    console.log('Sever received unsubscribeMarketData', message.message);
    this.send({
      messageType: ServerMessageType.success,
      message: { unsubscribed: true },
    });
  };

  placeOrder = (message: ClientEnvelope) => {
    console.log('Sever received placeOrder', message.message);
    this.send({
      messageType: ServerMessageType.executionReport,
      message: {
        orderId: 123,
        orderStatus: OrderStatus.filled,
      },
    });
  };
}
