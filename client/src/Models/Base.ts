import Decimal from 'decimal.js';

import { ClientMessage } from './ClientMessages';
import { ServerMessage } from './ServerMessages';

export interface Envelope {
  messageType: ClientMessage | ServerMessage;
  message: Message;
}

export interface Message {}

export interface Quote {
  bid: Decimal;
  offer: Decimal;
  minAmount: Decimal;
  maxAmount: Decimal;
}

export interface QuoteString {
  bid: string;
  offer: string;
  minAmount: string;
  maxAmount: string;
}
