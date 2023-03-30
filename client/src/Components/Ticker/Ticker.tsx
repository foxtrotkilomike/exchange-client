import { useState } from 'react';

import Dropdown from './Dropdown';
import classes from './Ticker.module.scss';
import TickerControl from './TickerControl';
import { instrumentOptions } from '../../Config/Data';
import { Instrument } from '../../Enums';

const Ticker = (): JSX.Element => {
  const [selectedOptionValue, setSelectedOptionValue] = useState(
    Instrument.eur_usd,
  );

  return (
    <article className={classes.ticker}>
      <Dropdown
        options={instrumentOptions}
        selectedOptionValue={selectedOptionValue}
        onChange={(option: Instrument) => setSelectedOptionValue(option)}
      />
      <input
        type="number"
        min="0"
        step="1"
        placeholder="Amount"
        className={classes.ticker__input}
      />
      <TickerControl />
    </article>
  );
};

export default Ticker;
