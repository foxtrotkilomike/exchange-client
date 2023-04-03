import { useCallback } from 'react';

import { observer } from 'mobx-react-lite';
import toast from 'react-hot-toast';

import Dropdown from './Dropdown';
import classes from './Ticker.module.scss';
import TickerControl from './TickerControl';
import { ButtonType } from './TickerControl/TickerControl';
import TickerInput from './TickerInput';
import { instrumentOptions } from '../../Config/Data';
import { Instrument, OrderSide } from '../../Config/Enums';
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
    placeOrder,
  } = store;

  const currentSellingRate = sellingRate.at(-1);
  const currentPurchaseRate = purchaseRate.at(-1);

  const handlePlaceOrder = useCallback(
    (buttonType: ButtonType) => {
      if (!instrumentAmount) {
        toast.error('Please, provide instrument amount');
        return;
      }
      if (!currentSellingRate || !currentPurchaseRate) {
        toast.error('Please, wait a second for quotes update');
        return;
      }

      const side =
        buttonType === ButtonType.sell ? OrderSide.sell : OrderSide.buy;
      placeOrder({ side, amount: instrumentAmount });
      toast.success('Your transaction is being processed');
      setInstrumentAmount(null);
    },
    [
      instrumentAmount,
      currentSellingRate,
      currentPurchaseRate,
      placeOrder,
      setInstrumentAmount,
    ],
  );

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
          value={currentSellingRate}
          onClick={handlePlaceOrder}
          buttonType={ButtonType.sell}
        />
        <div className={classes['control-separator']} />
        <TickerControl
          value={currentPurchaseRate}
          onClick={handlePlaceOrder}
          buttonType={ButtonType.buy}
        />
      </div>
    </article>
  );
};

export default observer(Ticker);
