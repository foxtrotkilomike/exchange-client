import { useState } from 'react';

import Dropdown from './Dropdown';
import classes from './Ticker.module.scss';
import TickerControl from './TickerControl';
import TickerInput from './TickerInput';
import { instrumentOptions } from '../../Config/Data';
import { Instrument } from '../../Enums';

const Ticker = (): JSX.Element => {
  const [selectedOptionValue, setSelectedOptionValue] = useState(
    Instrument.eur_usd,
  );
  const [instrumentAmount, setInstrumentAmount] = useState<number | null>(null);

  return (
    <article className={classes.ticker}>
      <Dropdown
        options={instrumentOptions}
        selectedOptionValue={selectedOptionValue}
        onChange={(option: Instrument) => setSelectedOptionValue(option)}
      />
      <TickerInput value={instrumentAmount} onChange={setInstrumentAmount} />
      <TickerControl />
    </article>
  );
};

export default Ticker;
