import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TickerInput from './TickerInput';

import '@testing-library/jest-dom';

describe('TickerInput component', () => {
  it('should render placeholder', () => {
    const instrumentAmount = null;
    const setInstrumentAmount = () => {};
    render(
      <TickerInput value={instrumentAmount} onChange={setInstrumentAmount} />,
    );

    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
  });

  it('should invoke external callback onChange when user types', async () => {
    const instrumentAmount = null;
    const setInstrumentAmount = jest.fn();
    render(
      <TickerInput value={instrumentAmount} onChange={setInstrumentAmount} />,
    );
    const user = userEvent.setup();
    const input = screen.getByRole('spinbutton');
    await user.type(input, '123');

    expect(setInstrumentAmount).toBeCalled();
  });
});
