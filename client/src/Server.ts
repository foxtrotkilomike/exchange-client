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
  CancelOrder,
  ClientEnvelope,
  ServerPlaceOrder,
  SubscribeMarketData,
  UnsubscribeMarketData,
} from './Models/ClientMessages';
import { ServerEnvelope } from './Models/ServerMessages';
import MessageEventT from './Types/MessageEvent';
import generateId from './Utils/generateId';
import getRandomOrderStatus from './Utils/getRandomOrderStatus';
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
    [Instrument.eur_rub]: 83,
    [Instrument.eur_usd]: 0.9,
    [Instrument.usd_rub]: 74,
  };
  private _purchaseQuotes: QuotesMap = {
    [Instrument.eur_rub]: [],
    [Instrument.eur_usd]: [],
    [Instrument.usd_rub]: [],
  };
  private _purchasePivotQuotes: PivotQuotesMap = {
    [Instrument.eur_rub]: 85,
    [Instrument.eur_usd]: 1,
    [Instrument.usd_rub]: 76,
  };
  private _timestamps: string[] = [];
  private _updateQuotesIntervalId: ReturnType<typeof setInterval> | null = null;
  private _subscriptionsId: Record<string, ReturnType<typeof setInterval>> = {};
  private _ordersId: Record<string, ReturnType<typeof setTimeout>> = {};
  private _quotesUpdateInterval = 3000;
  private _orderProcessingInterval = 6000;
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

        case ClientMessageType.cancelOrder:
          this.cancelOrder(message);
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
    const subscriptionInstrument = (message.message as SubscribeMarketData)
      .instrument;
    const subscriptionId = generateId();

    this.send({
      messageType: ServerMessageType.success,
      message: { subscriptionId: subscriptionId },
    });

    this.createSubscription(subscriptionId, subscriptionInstrument);
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
    const order = message.message as ServerPlaceOrder;
    this.processOrder(order).then((orderStatus) =>
      this.send({
        messageType: ServerMessageType.executionReport,
        message: {
          orderId: order.orderId,
          orderStatus,
        },
      }),
    );
  };

  processOrder = async (order: ServerPlaceOrder): Promise<OrderStatus> => {
    return new Promise((res) => {
      const timeout = setTimeout(
        () => res(getRandomOrderStatus()),
        this._orderProcessingInterval,
      );

      this._ordersId[order.orderId] = timeout;
    });
  };

  cancelOrder = (message: ClientEnvelope) => {
    const { orderId } = message.message as CancelOrder;
    const timeout = this._ordersId[orderId];

    if (timeout) {
      clearTimeout(timeout);
      delete this._ordersId[orderId];

      this.send({
        messageType: ServerMessageType.executionReport,
        message: {
          orderId: orderId,
          orderStatus: OrderStatus.cancelled,
        },
      });
    }
  };

  createSubscription = (
    subscriptionId: string,
    subscriptionInstrument: Instrument,
  ) => {
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
              timestamps: this._timestamps,
            },
          },
        }),
      this._quotesUpdateInterval,
    );

    this._subscriptionsId[subscriptionId] = subscriptionIntervalId;
  };

  updateAllQuotes = () => {
    this.updateSellQuotes();
    this.updatePurchaseQuotes();
    this.updateTimestamps();
  };

  updateSellQuotes = () => {
    const [quotes, pivotQuotes] = this.getQuotes(OrderSide.sell);
    this.updateQuotes(quotes, pivotQuotes);
  };

  updatePurchaseQuotes = () => {
    const [quotes, pivotQuotes] = this.getQuotes(OrderSide.buy);
    this.updateQuotes(quotes, pivotQuotes);
  };

  updateTimestamps = () => {
    this._timestamps.push(new Date().toLocaleString('ru-RU'));
  };

  updateQuotes = (quotes: QuotesMap, pivotQuotes: PivotQuotesMap) => {
    Object.entries(quotes).forEach(([quoteType, quoteValue]) => {
      const pivotQuote = pivotQuotes[quoteType as Instrument];
      const currentQuote = quoteValue.at(-1)?.offer.toNumber() || pivotQuote;
      const newQuote = this.createQuote(currentQuote, pivotQuote);
      quotes[quoteType as Instrument].push(newQuote);
    });
  };

  createQuote = (currentQuote: number, pivotQuote: number) => {
    const sign = Math.random() < 0.5 ? -1 : 1;
    const deviationPercentage = 0.005;
    const newQuoteOffer =
      currentQuote + Math.random() * deviationPercentage * pivotQuote * sign;
    return {
      bid: new Decimal(0),
      offer: new Decimal(newQuoteOffer),
      minAmount: new Decimal(0),
      maxAmount: new Decimal(1000000),
    };
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
