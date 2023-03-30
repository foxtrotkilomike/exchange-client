import Decimal from 'decimal.js';

import { Envelope, Message } from './Base';
import { ClientMessageType, Instrument, OrderSide } from '../Enums';

export interface ClientEnvelope extends Envelope {
  messageType: ClientMessageType;
}

export type ClientMessage = Message;

export interface SubscribeMarketData extends ClientMessage {
  instrument: Instrument;
}

export interface UnsubscribeMarketData extends ClientMessage {
  subscriptionId: string;
}

export interface PlaceOrder extends ClientMessage {
  instrument: Instrument;
  side: OrderSide;
  amount: Decimal;
  price: Decimal;
}
