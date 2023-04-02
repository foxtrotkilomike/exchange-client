import classNames from 'classnames';
import Decimal from 'decimal.js';

import classes from './TickerControl.module.scss';

export enum ButtonType {
  sell = 'SELL',
  buy = 'BUY',
}

type TickerControlProps = {
  value: Decimal | undefined;
  buttonType: ButtonType;
  onClick: () => void;
};

const TickerControl = ({
  value,
  buttonType,
  onClick,
}: TickerControlProps): JSX.Element => {
  const renderControlValue = (value: Decimal) => {
    const [whole, fraction] = value.toFixed(3).split('.');
    const accentFraction = fraction.split('').slice(0, 2);
    const restFraction = fraction.split('').slice(2);
    return (
      <>
        {whole}.
        <span className={classes.control__text_accent}>{accentFraction}</span>
        {restFraction}
      </>
    );
  };

  const buttonClassName = classNames(classes.control__button, {
    [classes.control__button_sell]: buttonType === ButtonType.sell,
    [classes.control__button_buy]: buttonType === ButtonType.buy,
  });

  return (
    <div className={classes.control}>
      <p className={classes.control__text} title={value?.toString()}>
        {value === undefined ? '-' : renderControlValue(value)}
      </p>
      <button onClick={onClick} className={buttonClassName}>
        {buttonType}
      </button>
    </div>
  );
};

export default TickerControl;
