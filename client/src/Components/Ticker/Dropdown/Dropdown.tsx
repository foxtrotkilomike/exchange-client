import React, { useEffect, useMemo, useState } from 'react';

import classes from './Dropdown.module.scss';
import { Instrument } from '../../../Config/Enums';
import { Option } from '../../../Types/Option';

type DropdownProps = {
  options: Option[];
  selectedOptionValue: Instrument;
  onChange: (value: Instrument) => void;
};

const Dropdown = ({
  options,
  selectedOptionValue,
  onChange,
}: DropdownProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOptionLabel = useMemo(() => {
    return (
      options.find((option) => option.value === selectedOptionValue)?.label ||
      options[0].label
    );
  }, [options, selectedOptionValue]);

  useEffect(() => {
    const closeSearchFilter = () => {
      setIsOpen(false);
    };
    window.addEventListener('click', closeSearchFilter);

    return () => window.removeEventListener('click', closeSearchFilter);
  }, []);

  const optionsList = options.map(({ value, label }) => (
    <li key={value}>
      <input
        type="radio"
        id={label}
        name="dropdown"
        checked={value === selectedOptionValue}
        onChange={() => onChange(value)}
      />
      <label
        className={classes.dropdown__option}
        htmlFor={label}
        onClick={() => {
          onChange(value);
          setIsOpen((isOpen) => !isOpen);
        }}
      >
        {label}
      </label>
    </li>
  ));

  return (
    <div className={classes.dropdown}>
      <button
        className={classes.dropdown__button}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((isOpen) => !isOpen);
        }}
        aria-label="Select a trading instrument"
      >
        {selectedOptionLabel}
      </button>
      {isOpen && <ul className={classes.dropdown__list}>{optionsList}</ul>}
    </div>
  );
};

export default React.memo(Dropdown);
