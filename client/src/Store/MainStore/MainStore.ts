import Decimal from 'decimal.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { Instrument } from '../../Config/Enums';
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
  private _sellingRate: Decimal | null = new Decimal(8.558);
  private _purchaseRate: Decimal | null = new Decimal(8.559);

  constructor() {
    makeObservable<MainStore, PrivateFields>(this, {
      _connection: observable,
      _chosenInstrument: observable,
      _instrumentAmount: observable,
      _sellingRate: observable,
      _purchaseRate: observable,
      chosenInstrument: computed,
      instrumentAmount: computed,
      sellingRate: computed,
      purchaseRate: computed,
      setInstrument: action,
      setInstrumentAmount: action,
      setSellingRate: action,
      setPurchaseRate: action,
    });
    this._connection = new WSConnector();
    this._connection.connect();
  }

  get chosenInstrument() {
    return this._chosenInstrument;
  }

  get instrumentAmount() {
    return this._instrumentAmount;
  }

  get sellingRate() {
    return this._sellingRate;
  }

  get purchaseRate() {
    return this._purchaseRate;
  }

  setInstrument = (instrument: Instrument) => {
    this._chosenInstrument = instrument;
  };

  setInstrumentAmount = (instrumentAmount: Decimal | null) => {
    this._instrumentAmount = instrumentAmount;
  };

  setSellingRate = (sellingRate: Decimal | null) => {
    this._sellingRate = sellingRate;
  };

  setPurchaseRate = (purchaseRate: Decimal | null) => {
    this._purchaseRate = purchaseRate;
  };

  destroy = () => {
    this._connection.disconnect();
  };
}
