import Decimal from 'decimal.js';

import { Instrument } from '../../Config/Enums';
import { ILocalStore } from '../../Types/ILocalStore';

export default class MainStoreStub implements ILocalStore {
  chosenInstrument = Instrument.eur_usd;
  instrumentAmount: Decimal | null = null;
  sellingRate: Decimal | null = new Decimal(8.558);
  purchaseRate: Decimal | null = new Decimal(8.558);

  setChosenInstrument = (chosenInstrument: Instrument) => {
    this.chosenInstrument = chosenInstrument;
  };
  setInstrumentAmount = (instrumentAmount: Decimal | null) => {
    this.instrumentAmount = instrumentAmount;
  };
  setSellingRate = (sellingRate: Decimal | null) => {
    this.sellingRate = sellingRate;
  };
  setPurchaseRate = (sellingRate: Decimal | null) => {
    this.purchaseRate = sellingRate;
  };

  destroy() {}
}
