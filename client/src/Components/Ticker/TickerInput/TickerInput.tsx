import React, { useCallback } from 'react';

import Decimal from 'decimal.js';

import classes from './TickerInput.module.scss';

type TickerInputProps = {
  value: Decimal | null;
  onChange: (value: Decimal) => void;
};

const placeholder = 'Amount';

const TickerInput = ({ value, onChange }: TickerInputProps): JSX.Element => {
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.placeholder = '';
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.placeholder = placeholder;
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(new Decimal(e.target.value) || 0);
    },
    [onChange],
  );

  const inputValue = value === null ? '' : value.toNumber();

  return (
    <input
      type="number"
      min="0"
      step="1"
      value={inputValue}
      onChange={handleChange}
      placeholder={placeholder}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={classes.input}
      required
    />
  );
};

export default React.memo(TickerInput);
