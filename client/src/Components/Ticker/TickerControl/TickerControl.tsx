import classNames from 'classnames';
import Decimal from 'decimal.js';

import classes from './TickerControl.module.scss';

export enum ButtonType {
  sell = 'SELL',
  buy = 'BUY',
}

type TickerControlProps = {
  value: Decimal;
  buttonType: ButtonType;
  onClick: () => void;
};

const TickerControl = ({
  value,
  buttonType,
  onClick,
}: TickerControlProps): JSX.Element => {
  const [whole, fraction] = value.toFixed(3).toString().split('.');
  const accentFraction = fraction.split('').slice(0, 2);
  const restFraction = fraction.split('').slice(2);
  const buttonClassName = classNames(classes.control__button, {
    [classes.control__button_sell]: buttonType === ButtonType.sell,
    [classes.control__button_buy]: buttonType === ButtonType.buy,
  });

  return (
    <div className={classes.control}>
      <p className={classes.control__text} title={value.toString()}>
        {whole}.
        <span className={classes.control__text_accent}>{accentFraction}</span>
        {restFraction}
      </p>
      <button onClick={onClick} className={buttonClassName}>
        {buttonType}
      </button>
    </div>
  );
};

export default TickerControl;
