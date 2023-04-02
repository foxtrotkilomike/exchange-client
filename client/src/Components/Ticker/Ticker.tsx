import { useCallback } from 'react';

import { observer } from 'mobx-react-lite';

import Dropdown from './Dropdown';
import classes from './Ticker.module.scss';
import TickerControl from './TickerControl';
import { ButtonType } from './TickerControl/TickerControl';
import TickerInput from './TickerInput';
import { instrumentOptions } from '../../Config/Data';
import { Instrument } from '../../Config/Enums';
import MainStore from '../../Store/MainStore';

type TickerProps = {
  store: MainStore;
};

const Ticker = ({ store }: TickerProps): JSX.Element => {
  const {
    chosenInstrument,
    instrumentAmount,
    sellingRate,
    purchaseRate,
    setInstrument,
    setInstrumentAmount,
  } = store;

  const handleSell = useCallback(() => {
    console.log(sellingRate?.times(instrumentAmount || 0));
    setInstrumentAmount(null);
  }, [sellingRate, instrumentAmount, setInstrumentAmount]);
  const handlePurchase = useCallback(() => {
    console.log(purchaseRate?.times(instrumentAmount || 0));
    setInstrumentAmount(null);
  }, [purchaseRate, instrumentAmount, setInstrumentAmount]);

  return (
    <article className={classes.ticker}>
      <Dropdown
        options={instrumentOptions}
        selectedOptionValue={chosenInstrument}
        onChange={(option: Instrument) => setInstrument(option)}
      />
      <TickerInput value={instrumentAmount} onChange={setInstrumentAmount} />
      <div className={classes['controls-wrapper']}>
        <TickerControl
          value={sellingRate}
          onClick={handleSell}
          buttonType={ButtonType.sell}
        />
        <div className={classes['control-separator']} />
        <TickerControl
          value={purchaseRate}
          onClick={handlePurchase}
          buttonType={ButtonType.buy}
        />
      </div>
    </article>
  );
};

export default observer(Ticker);
