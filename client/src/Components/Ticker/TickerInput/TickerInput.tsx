import React, { useCallback } from 'react';

import classes from './TickerInput.module.scss';

type TickerInputProps = {
  value: number | null;
  onChange: (value: number) => void;
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
      onChange(Number(e.target.value) || 0);
    },
    [onChange],
  );

  const inputValue = value === null ? '' : value;

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
