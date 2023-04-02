import Decimal from 'decimal.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { Instrument } from '../../Config/Enums';
import {
  ClientMarketDataUpdate,
  ServerEnvelope,
} from '../../Models/ServerMessages';
import { ILocalStore } from '../../Types/ILocalStore';
import WSConnector from '../../WSClient';

type PrivateFields =
  | '_connection'
  | '_chosenInstrument'
  | '_instrumentAmount'
  | '_sellingRate'
  | '_purchaseRate';

export default class MainStore implements ILocalStore {
  private _connection: WSConnector;
  private _chosenInstrument = Instrument.eur_usd;
  private _instrumentAmount: Decimal | null = null;
  private _sellingRate: Decimal[] = [];
  private _purchaseRate: Decimal[] = [];
  private _subscriptionId: string | null = null;
  private _isActualSubscriptionId = false;

  constructor() {
    makeObservable<MainStore, PrivateFields>(this, {
      _connection: observable,
      _chosenInstrument: observable,
      _instrumentAmount: observable,
      _sellingRate: observable.ref,
      _purchaseRate: observable.ref,
      chosenInstrument: computed,
      instrumentAmount: computed,
      sellingRate: computed,
      purchaseRate: computed,
      setInstrument: action,
      setInstrumentAmount: action,
      handleSuccessMessage: action,
      handleMarketDataUpdate: action,
      destroy: action,
    });
    this._connection = new WSConnector(
      this.handleMarketDataUpdate,
      this.handleSuccessMessage,
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

  setInstrument = (instrument: Instrument) => {
    if (instrument === this.chosenInstrument || !this._subscriptionId) return;

    this._connection.unsubscribeMarketData(this._subscriptionId);
    this._sellingRate = [];
    this._purchaseRate = [];
    this._isActualSubscriptionId = false;
    this._chosenInstrument = instrument;
    this._connection.subscribeMarketData(this._chosenInstrument);
  };

  setInstrumentAmount = (instrumentAmount: Decimal | null) => {
    this._instrumentAmount = instrumentAmount;
  };

  handleSuccessMessage = (message: ServerEnvelope) => {
    console.log('Client received success', message);
    switch (true) {
      case 'subscriptionId' in message.message:
        if ('subscriptionId' in message.message) {
          this._subscriptionId = message.message.subscriptionId;
          this._isActualSubscriptionId = true;
        }
        break;
    }
  };

  handleMarketDataUpdate = (message: ServerEnvelope) => {
    console.log('marketDataUpdate on client', message.message);
    const {
      quotes: { sell, purchase },
    } = message.message as ClientMarketDataUpdate;

    if (this._isActualSubscriptionId) {
      this._sellingRate = sell.map((rate) => new Decimal(rate.offer));
      this._purchaseRate = purchase.map((rate) => new Decimal(rate.offer));
    }
  };

  destroy = () => {
    if (this._subscriptionId) {
      this._connection.unsubscribeMarketData(this._subscriptionId);
    }
    this._connection.disconnect();
  };
}
