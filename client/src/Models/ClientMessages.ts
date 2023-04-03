import Decimal from 'decimal.js';

import { Envelope, Message } from './Base';
import {
  ClientMessageType,
  Instrument,
  OrderSide,
  OrderStatus,
} from '../Config/Enums';

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
  orderId: string;
  instrument: Instrument;
  side: OrderSide;
  amount: Decimal;
  price: Decimal;
}

export interface ClientPlaceOrder extends ClientMessageInit {
  orderId: string;
  creationTime: Date;
  changeTime: Date | null;
  status: OrderStatus;
  instrument: Instrument;
  side: OrderSide;
  amount: Decimal;
  price: Decimal;
}

export interface ServerPlaceOrder extends ClientMessageInit {
  orderId: string;
  instrument: Instrument;
  side: OrderSide;
  amount: string;
  price: string;
}

export type ClientMessage =
  | SubscribeMarketData
  | UnsubscribeMarketData
  | PlaceOrder;
