import Dropdown from './Dropdown';
import classes from './Ticker.module.scss';
import TickerControl from './TickerControl';

const Ticker = (): JSX.Element => {
  return (
    <article className={classes.ticker}>
      <Dropdown />
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
