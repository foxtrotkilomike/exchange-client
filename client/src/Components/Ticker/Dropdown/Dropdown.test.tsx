import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Dropdown from './Dropdown';
import '@testing-library/jest-dom';
import { Instrument } from '../../../Enums';
import { Option } from '../../../Types/Option';

const options: Option[] = [
  {
    value: Instrument.eur_rub,
    label: 'EUR/RUB',
  },
  {
    value: Instrument.eur_usd,
    label: 'EUR/USD',
  },
  {
    value: Instrument.usd_rub,
    label: 'USD/RUB',
  },
];

const selectedOption = Instrument.eur_rub;

describe('Dropdown component', () => {
  it('should render select button', () => {
    render(
      <Dropdown
        options={options}
        selectedOptionValue={selectedOption}
        onChange={() => {}}
      />,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render options list on button click', async () => {
    render(
      <Dropdown
        options={options}
        selectedOptionValue={selectedOption}
        onChange={() => {}}
      />,
    );
    const user = userEvent.setup();
    const dropdownButton = screen.getByRole('button');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    await user.click(dropdownButton);

    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('should render valid options list options', async () => {
    render(
      <Dropdown
        options={options}
        selectedOptionValue={selectedOption}
        onChange={() => {}}
      />,
    );
    const user = userEvent.setup();
    const dropdownButton = screen.getByRole('button');

    await user.click(dropdownButton);

    options.forEach((option) => {
      expect(screen.getByLabelText(option.label)).toBeInTheDocument();
    });
  });

  it('should close after click on any option', async () => {
    render(
      <Dropdown
        options={options}
        selectedOptionValue={selectedOption}
        onChange={() => {}}
      />,
    );
    const user = userEvent.setup();
    const dropdownButton = screen.getByRole('button');

    await user.click(dropdownButton);
    await user.click(screen.getByLabelText(options[0].label));

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should close after click outside a list', async () => {
    render(
      <Dropdown
        options={options}
        selectedOptionValue={selectedOption}
        onChange={() => {}}
      />,
    );
    const user = userEvent.setup();
    const dropdownButton = screen.getByRole('button');

    await user.click(dropdownButton);
    await user.click(document.body);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
