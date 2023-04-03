import Decimal from 'decimal.js';

import { Instrument } from '../../Config/Enums';
import { ILocalStore } from '../../Types/ILocalStore';

export default class MainStoreStub implements ILocalStore {
  chosenInstrument = Instrument.eur_usd;
  instrumentAmount: Decimal | null = null;
  sellingRate: Decimal[] = [new Decimal(8.558)];
  purchaseRate: Decimal[] = [new Decimal(8.558)];

  setChosenInstrument = (chosenInstrument: Instrument) => {
    this.chosenInstrument = chosenInstrument;
  };
  setInstrumentAmount = (instrumentAmount: Decimal | null) => {
    this.instrumentAmount = instrumentAmount;
  };
  setSellingRate = (sellingRate: Decimal[]) => {
    this.sellingRate = sellingRate;
  };
  setPurchaseRate = (sellingRate: Decimal[]) => {
    this.purchaseRate = sellingRate;
  };
  placeOrder = () => {};

  destroy() {}
}
