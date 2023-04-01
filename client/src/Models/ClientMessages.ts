import Decimal from 'decimal.js';

import { Envelope, Message } from './Base';
import { ClientMessageType, Instrument, OrderSide } from '../Config/Enums';

export interface ClientEnvelope extends Envelope {
  messageType: ClientMessageType;
  message: ClientMessage;
}

export type ClientMessageInit = Message;

export interface SubscribeMarketData extends ClientMessageInit {
  instrument: Instrument;
}

export interface UnsubscribeMarketData extends ClientMessageInit {
  subscriptionId: string;
}

export interface PlaceOrder extends ClientMessageInit {
  instrument: Instrument;
  side: OrderSide;
  amount: Decimal;
  price: Decimal;
}

export type ClientMessage =
  | SubscribeMarketData
  | UnsubscribeMarketData
  | PlaceOrder;
