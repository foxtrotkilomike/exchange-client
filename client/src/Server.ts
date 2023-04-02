import Decimal from 'decimal.js';

import {
  ClientMessageType,
  Instrument,
  OrderSide,
  OrderStatus,
  ServerMessageType,
  WSEvent,
} from './Config/Enums';
import MessageEvent from './MessageEvent';
import { Quote } from './Models/Base';
import {
  ClientEnvelope,
  SubscribeMarketData,
  UnsubscribeMarketData,
} from './Models/ClientMessages';
import { ServerEnvelope } from './Models/ServerMessages';
import MessageEventT from './Types/MessageEvent';
import WebSocket from './WebSocket';

type QuotesMap = Record<Instrument, Quote[]>;
type PivotQuotesMap = Record<Instrument, number>;

export default class Server extends EventTarget {
  private _ws: WebSocket;
  private _sellQuotes: QuotesMap = {
    [Instrument.eur_rub]: [],
    [Instrument.eur_usd]: [],
    [Instrument.usd_rub]: [],
  };
  private _sellPivotQuotes: PivotQuotesMap = {
    [Instrument.eur_rub]: 65,
    [Instrument.eur_usd]: 0.9,
    [Instrument.usd_rub]: 60,
  };
  private _purchaseQuotes: QuotesMap = {
    [Instrument.eur_rub]: [],
    [Instrument.eur_usd]: [],
    [Instrument.usd_rub]: [],
  };
  private _purchasePivotQuotes: PivotQuotesMap = {
    [Instrument.eur_rub]: 70,
    [Instrument.eur_usd]: 1,
    [Instrument.usd_rub]: 65,
  };
  private _updateQuotesIntervalId: ReturnType<typeof setInterval> | null = null;
  private _subscriptionsId: Record<string, ReturnType<typeof setInterval>> = {};
  private _quotesUpdateInterval = 3000;
  private _serverResponseDelay = 300;

  constructor(webSocket: WebSocket) {
    super();
    this._ws = webSocket;
    this._ws.addEventListener(WSEvent.message, (e: Event) => {
      if (e.hasOwnProperty('data')) {
        this.onmessage(e as MessageEventT);
      }
    });
    this._ws.addEventListener(WSEvent.close, this.onclose);
    this.openConnection();
    this.startUpdateQuotes();
  }

  openConnection = () => {
    setTimeout(() => {
      this.dispatchEvent(new Event(WSEvent.open));
    }, this._serverResponseDelay);
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
    setTimeout(() => {
      this.dispatchEvent(new Event(WSEvent.close));
      this.destroy();
    }, this._serverResponseDelay);
  };

  send = (message: ServerEnvelope) => {
    setTimeout(
      () =>
        this.dispatchEvent(
          new MessageEvent<string>(WSEvent.message, JSON.stringify(message)),
        ),
      this._serverResponseDelay,
    );
  };

  subscribeMarketData = (message: ClientEnvelope) => {
    console.log('Sever received subscribeMarketData', message.message);
    const subscriptionInstrument = (message.message as SubscribeMarketData)
      .instrument;
    const subscriptionId = Math.round(Math.random() * 1000000).toString();

    this.send({
      messageType: ServerMessageType.success,
      message: { subscriptionId: subscriptionId },
    });

    const subscriptionIntervalId = setInterval(
      () =>
        this.send({
          messageType: ServerMessageType.marketDataUpdate,
          message: {
            subscriptionId: subscriptionId,
            instrument: subscriptionInstrument,
            quotes: {
              sell: this._sellQuotes[subscriptionInstrument],
              purchase: this._purchaseQuotes[subscriptionInstrument],
            },
          },
        }),
      this._quotesUpdateInterval,
    );

    this._subscriptionsId[subscriptionId] = subscriptionIntervalId;
  };

  unsubscribeMarketData = (message: ClientEnvelope) => {
    const clientSubscriptionId = message.message as UnsubscribeMarketData;
    const subscriptionId =
      this._subscriptionsId[clientSubscriptionId.subscriptionId];
    if (subscriptionId) {
      clearInterval(subscriptionId);
    }

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

  updateAllQuotes = () => {
    this.updateSellQuotes();
    this.updatePurchaseQuotes();
  };

  updateSellQuotes = () => {
    const [quotes, pivotQuotes] = this.getQuotes(OrderSide.sell);
    this.updateQuotes(quotes, pivotQuotes);
  };

  updatePurchaseQuotes = () => {
    const [quotes, pivotQuotes] = this.getQuotes(OrderSide.buy);
    this.updateQuotes(quotes, pivotQuotes);
  };

  updateQuotes = (quotes: QuotesMap, pivotQuotes: PivotQuotesMap) => {
    Object.entries(quotes).forEach(([quoteType, quoteValue]) => {
      const pivotQuote = pivotQuotes[quoteType as Instrument];
      const currentQuote = quoteValue.at(-1)?.offer.toNumber() || pivotQuote;
      const sign = Math.random() < 0.5 ? -1 : 1;
      const deviationPercentage = 0.005;
      const newQuoteOffer =
        currentQuote + Math.random() * deviationPercentage * pivotQuote * sign;
      const newQuote: Quote = {
        bid: new Decimal(0),
        offer: new Decimal(newQuoteOffer),
        minAmount: new Decimal(0),
        maxAmount: new Decimal(1000000),
      };
      quotes[quoteType as Instrument].push(newQuote);
    });
  };

  getQuotes = (type: OrderSide) => {
    const quotesMap = {
      [OrderSide.sell]: {
        quote: this._sellQuotes,
        pivot: this._sellPivotQuotes,
      },
      [OrderSide.buy]: {
        quote: this._purchaseQuotes,
        pivot: this._purchasePivotQuotes,
      },
    };

    return [quotesMap[type].quote, quotesMap[type].pivot] as const;
  };

  startUpdateQuotes = () => {
    this._updateQuotesIntervalId = setInterval(
      () => this.updateAllQuotes(),
      this._quotesUpdateInterval,
    );
  };

  stopUpdateQuotes = () => {
    this._updateQuotesIntervalId && clearInterval(this._updateQuotesIntervalId);
  };

  cancelSubscriptions = () => {
    Object.values(this._subscriptionsId).forEach((subscriptionId) => {
      if (subscriptionId) {
        clearInterval(subscriptionId);
      }
    });
  };

  destroy = () => {
    this.stopUpdateQuotes();
    this.cancelSubscriptions();
  };
}
