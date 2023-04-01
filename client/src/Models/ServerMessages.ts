import { Envelope, Message, Quote } from './Base';
import { Instrument, OrderStatus, ServerMessageType } from '../Config/Enums';

export interface ServerEnvelope extends Envelope {
  messageType: ServerMessageType;
  message: ServerMessage;
}

export type ServerMessageInit = Message;

export interface ErrorInfo extends ServerMessageInit {
  reason: string;
}

export type SuccessInfo = ServerMessageInit;

export interface ExecutionReport extends ServerMessageInit {
  orderId: string;
  orderStatus: OrderStatus;
}

export interface MarketDataUpdate extends ServerMessageInit {
  subscriptionId: string;
  instrument: Instrument;
  quotes: [Quote];
}

export type ServerMessage =
  | ErrorInfo
  | SuccessInfo
  | ExecutionReport
  | MarketDataUpdate;
