import { useCallback, useState } from 'react';

import Decimal from 'decimal.js';

import Dropdown from './Dropdown';
import classes from './Ticker.module.scss';
import TickerControl from './TickerControl';
import { ButtonType } from './TickerControl/TickerControl';
import TickerInput from './TickerInput';
import { instrumentOptions } from '../../Config/Data';
import { Instrument } from '../../Enums';

const sellingRate = new Decimal(8.558);
const purchaseRate = new Decimal(8.559);

const Ticker = (): JSX.Element => {
  const [selectedOptionValue, setSelectedOptionValue] = useState(
    Instrument.eur_usd,
  );
  const [instrumentAmount, setInstrumentAmount] = useState<number | null>(null);

  const handleSell = useCallback(() => {
    console.log(sellingRate.times(instrumentAmount || 0));
    setInstrumentAmount(null);
  }, [instrumentAmount]);
  const handlePurchase = useCallback(() => {
    console.log(purchaseRate.times(instrumentAmount || 0));
    setInstrumentAmount(null);
  }, [instrumentAmount]);

  return (
    <article className={classes.ticker}>
      <Dropdown
        options={instrumentOptions}
        selectedOptionValue={selectedOptionValue}
        onChange={(option: Instrument) => setSelectedOptionValue(option)}
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

export default Ticker;
