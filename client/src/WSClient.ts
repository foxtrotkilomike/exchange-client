import Decimal from 'decimal.js';

import {
  ClientMessageType,
  Instrument,
  OrderSide,
  ServerMessageType,
} from './Config/Enums';
import { ClientEnvelope } from './Models/ClientMessages';
import { ServerEnvelope } from './Models/ServerMessages';
import WebSocket from './WebSocket';

export default class WSConnector {
  connection: WebSocket | undefined;

  constructor() {
    this.connection = undefined;
  }

  connect = () => {
    this.connection = new WebSocket('ws://127.0.0.1:3000/ws/');
    this.connection.onclose(() => {
      console.log('Server closed the connection');
      this.connection = undefined;
    });

    this.connection.onerror(() => {});

    this.connection.onopen(() => {
      console.log('Server opened the connection');
    });

    this.connection.onmessage((event) => {
      const message: ServerEnvelope = JSON.parse(event.data);
      switch (message.messageType) {
        case ServerMessageType.success:
          console.log('Client received success', message.message);
          break;
        case ServerMessageType.error:
          break;
        case ServerMessageType.executionReport:
          console.log('Client received executionReport', message.message);
          break;
        case ServerMessageType.marketDataUpdate:
          break;
      }
    });
  };

  disconnect = () => {
    this.connection?.close();
  };

  send = (message: ClientEnvelope) => {
    this.connection?.send(JSON.stringify(message));
  };

  subscribeMarketData = (instrument: Instrument) => {
    this.send({
      messageType: ClientMessageType.subscribeMarketData,
      message: {
        instrument,
      },
    });
  };

  unsubscribeMarketData = (subscriptionId: string) => {
    this.send({
      messageType: ClientMessageType.unsubscribeMarketData,
      message: {
        subscriptionId,
      },
    });
  };

  placeOrder = (
    instrument: Instrument,
    side: OrderSide,
    amount: Decimal,
    price: Decimal,
  ) => {
    this.send({
      messageType: ClientMessageType.placeOrder,
      message: {
        instrument,
        side,
        amount,
        price,
      },
    });
  };
}
