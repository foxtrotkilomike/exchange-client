import Decimal from 'decimal.js';

import {
  ClientMessageType,
  Instrument,
  OrderSide,
  ServerMessageType,
} from './Config/Enums';
import { ClientEnvelope } from './Models/ClientMessages';
import { ServerEnvelope } from './Models/ServerMessages';
import IWSConnector from './Types/IWSConnector';
import WebSocket from './WebSocket';

type ServerResponseHandler = (message: ServerEnvelope) => void;

export default class WSConnector implements IWSConnector {
  connection: WebSocket | undefined;
  onMarketDataUpdate;
  onSuccessMessage;
  onExecutionReport;

  constructor(
    onMarketDataUpdate: ServerResponseHandler,
    onSuccessMessage: ServerResponseHandler,
    onExecutionReport: ServerResponseHandler,
  ) {
    this.connection = undefined;
    this.onMarketDataUpdate = onMarketDataUpdate;
    this.onSuccessMessage = onSuccessMessage;
    this.onExecutionReport = onExecutionReport;
  }

  connect = () => {
    this.connection = new WebSocket('ws://127.0.0.1:3000/ws/');
    this.connection.onclose(() => {
      this.connection = undefined;
    });

    this.connection.onerror(() => {});

    this.connection.onopen(() => {});

    this.connection.onmessage((event) => {
      const message: ServerEnvelope = JSON.parse(event.data);
      switch (message.messageType) {
        case ServerMessageType.success:
          this.onSuccessMessage(message);
          break;
        case ServerMessageType.error:
          break;
        case ServerMessageType.executionReport:
          this.onExecutionReport(message);
          break;
        case ServerMessageType.marketDataUpdate:
          this.onMarketDataUpdate(message);
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
    orderId: string,
    instrument: Instrument,
    side: OrderSide,
    amount: Decimal,
    price: Decimal,
  ) => {
    this.send({
      messageType: ClientMessageType.placeOrder,
      message: {
        orderId,
        instrument,
        side,
        amount,
        price,
      },
    });
  };

  cancelOrder = (orderId: string) => {
    this.send({
      messageType: ClientMessageType.cancelOrder,
      message: {
        orderId,
      },
    });
  };

  validateConnection = () => !!this.connection;
}
