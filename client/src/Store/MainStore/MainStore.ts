import Decimal from 'decimal.js';
import { action, computed, makeObservable, observable } from 'mobx';
import toast from 'react-hot-toast';

import { Instrument, OrderSide, OrderStatus } from '../../Config/Enums';
import { ClientPlaceOrder, PlaceOrder } from '../../Models/ClientMessages';
import {
  ClientMarketDataUpdate,
  ExecutionReport,
  ServerEnvelope,
} from '../../Models/ServerMessages';
import { ILocalStore } from '../../Types/ILocalStore';
import generateId from '../../Utils/generateId';
import WSConnector from '../../WSClient';

type PrivateFields =
  | '_connection'
  | '_chosenInstrument'
  | '_instrumentAmount'
  | '_sellingRate'
  | '_purchaseRate'
  | '_timestamps'
  | '_orders';

export default class MainStore implements ILocalStore {
  private _connection: WSConnector;
  private _chosenInstrument = Instrument.eur_usd;
  private _instrumentAmount: Decimal | null = null;
  private _sellingRate: Decimal[] = [];
  private _purchaseRate: Decimal[] = [];
  private _subscriptionId: string | null = null;
  private _isActualSubscriptionId = false;
  private _orders: Record<string, ClientPlaceOrder> = {};
  private _timestamps: string[] = [];

  constructor() {
    makeObservable<MainStore, PrivateFields>(this, {
      _connection: observable,
      _chosenInstrument: observable,
      _instrumentAmount: observable,
      _sellingRate: observable.ref,
      _purchaseRate: observable.ref,
      _orders: observable.ref,
      _timestamps: observable.ref,
      chosenInstrument: computed,
      instrumentAmount: computed,
      sellingRate: computed,
      purchaseRate: computed,
      placeOrder: action,
      setInstrument: action,
      setInstrumentAmount: action,
      handleSuccessMessage: action,
      handleMarketDataUpdate: action,
      handleExecutionReport: action,
      destroy: action,
    });
    this._connection = new WSConnector(
      this.handleMarketDataUpdate,
      this.handleSuccessMessage,
      this.handleExecutionReport,
    );
    this._connection.connect();
    this._connection.subscribeMarketData(this._chosenInstrument);
  }

  get chosenInstrument(): Instrument {
    return this._chosenInstrument;
  }

  get instrumentAmount(): Decimal | null {
    return this._instrumentAmount;
  }

  get sellingRate(): Decimal[] {
    return this._sellingRate;
  }

  get purchaseRate(): Decimal[] {
    return this._purchaseRate;
  }

  get orders(): Record<string, ClientPlaceOrder> {
    return this._orders;
  }

  get timestamps(): string[] {
    return this._timestamps;
  }

  get subscriptionId(): string | null {
    return this._subscriptionId;
  }

  get isValidConnection(): boolean {
    return this._connection.validateConnection();
  }

  setInstrument = (instrument: Instrument) => {
    if (instrument === this.chosenInstrument) return;

    if (this._subscriptionId) {
      this._connection.unsubscribeMarketData(this._subscriptionId);
    }
    this._chosenInstrument = instrument;
    this._connection.subscribeMarketData(this._chosenInstrument);
  };

  setInstrumentAmount = (instrumentAmount: Decimal | null) => {
    this._instrumentAmount = instrumentAmount;
  };

  placeOrder = (order: Pick<PlaceOrder, 'side' | 'amount'>) => {
    const sellingRate = this._sellingRate.at(-1);
    const purchaseRate = this._purchaseRate.at(-1);

    if (sellingRate && purchaseRate) {
      const orderId = generateId();
      const instrument = this._chosenInstrument;
      const side = order.side;
      const amount = order.amount;
      let price = side === OrderSide.sell ? sellingRate : purchaseRate;
      price = new Decimal(price);

      this._connection.placeOrder(orderId, instrument, side, amount, price);
      this._orders = {
        ...this._orders,
        [orderId]: {
          orderId,
          creationTime: new Date(),
          changeTime: null,
          status: OrderStatus.active,
          instrument,
          side,
          amount,
          price,
        },
      };
    }
  };

  cancelOrder = (orderId: string) => {
    this._connection.cancelOrder(orderId);
  };

  handleSuccessMessage = (message: ServerEnvelope) => {
    switch (true) {
      case 'subscriptionId' in message.message:
        if ('subscriptionId' in message.message) {
          this._subscriptionId = message.message.subscriptionId;
          this._isActualSubscriptionId = true;
        }
        break;

      case 'unsubscribed' in message.message:
        if ('unsubscribed' in message.message) {
          this._sellingRate = [];
          this._purchaseRate = [];
          this._subscriptionId = null;
          this._isActualSubscriptionId = false;
        }
    }
  };

  handleMarketDataUpdate = (message: ServerEnvelope) => {
    const {
      quotes: { sell, purchase, timestamps },
    } = message.message as ClientMarketDataUpdate;

    if (this._isActualSubscriptionId) {
      this._sellingRate = sell.map((rate) => new Decimal(rate.offer));
      this._purchaseRate = purchase.map((rate) => new Decimal(rate.offer));
      this._timestamps = timestamps;
    }
  };

  handleExecutionReport = (message: ServerEnvelope) => {
    const { orderId, orderStatus } = message.message as ExecutionReport;
    const updatedOrder = this._orders[orderId];
    updatedOrder.status = orderStatus;
    updatedOrder.changeTime = new Date();
    this._orders = {
      ...this._orders,
      [orderId]: updatedOrder,
    };
    toast.success('Transaction completed');
  };

  destroy = () => {
    if (this._subscriptionId) {
      this._connection.unsubscribeMarketData(this._subscriptionId);
    }
    this._connection.disconnect();
  };
}
