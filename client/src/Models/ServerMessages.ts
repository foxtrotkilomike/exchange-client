import { Envelope, Message, Quote } from './Base';
import { Instrument, OrderStatus } from '../Config/Enums';

export interface ServerEnvelope extends Envelope {
  messageType: ServerMessage;
}

export type ServerMessage = Message;

export interface ErrorInfo extends ServerMessage {
  reason: string;
}

export type SuccessInfo = ServerMessage;

export interface ExecutionReport extends ServerMessage {
  orderId: string;
  orderStatus: OrderStatus;
}

export interface MarketDataUpdate extends ServerMessage {
  subscriptionId: string;
  instrument: Instrument;
  quotes: [Quote];
}
