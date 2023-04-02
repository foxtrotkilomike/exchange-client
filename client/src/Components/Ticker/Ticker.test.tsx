import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Ticker from './Ticker';
import '@testing-library/jest-dom';
import MainStoreStub from '../../__tests__/__mocks__/MainStore';
import { instrumentOptions } from '../../Config/Data';
import MainStore from '../../Store/MainStore';

let store = new MainStoreStub() as unknown as MainStore;

beforeEach(() => {
  store.destroy();
  store = new MainStoreStub() as unknown as MainStore;
});

describe('Ticker component', () => {
  it('should change dropdown button text after selecting any option', async () => {
    render(<Ticker store={store} />);
    const user = userEvent.setup();
    const dropdownButton = screen.getByLabelText('Select a trading instrument');

    await user.click(dropdownButton);
    await user.click(screen.getByLabelText(instrumentOptions[1].label));

    expect(dropdownButton).toHaveTextContent(instrumentOptions[1].label);
  });

  it('should change input value on type', async () => {
    const { rerender } = render(<Ticker store={store} />);
    const user = userEvent.setup();
    const input = screen.getByRole('spinbutton');
    await user.type(input, '2');

    expect(store.instrumentAmount?.toNumber()).toEqual(2);
    const updatedStore = { ...store } as MainStore;
    rerender(<Ticker store={updatedStore} />);
    expect(input).toHaveValue(2);
  });

  it('should clear input after click on purchase or sell', async () => {
    render(<Ticker store={store} />);
    const user = userEvent.setup();
    const sellButton = screen.getByText(/sell/i);
    const purchaseButton = screen.getByText(/buy/i);
    const input = screen.getByRole('spinbutton');

    await user.type(input, '123');
    await user.click(sellButton);
    expect(input).toHaveValue(null);

    await user.type(input, '123');
    await user.click(purchaseButton);
    expect(input).toHaveValue(null);
  });
});
