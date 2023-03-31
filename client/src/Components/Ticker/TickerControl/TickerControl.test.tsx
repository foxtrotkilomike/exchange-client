import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Decimal from 'decimal.js';

import TickerControl, { ButtonType } from './TickerControl';
import findTextNode from '../../../Utils/findTextNode';

import '@testing-library/jest-dom';

describe('TickerControl component', () => {
  it('should render value', () => {
    const controlValue = new Decimal(8.558);
    const handleClick = () => {};
    render(
      <TickerControl
        value={controlValue}
        onClick={handleClick}
        buttonType={ButtonType.buy}
      />,
    );

    expect(screen.getByText(findTextNode(`8.558`))).toBeInTheDocument();
  });

  it('should render button text', () => {
    const controlValue = new Decimal(8.558);
    const handleClick = () => {};
    render(
      <TickerControl
        value={controlValue}
        onClick={handleClick}
        buttonType={ButtonType.buy}
      />,
    );

    expect(screen.getByText(ButtonType.buy)).toBeInTheDocument();
  });

  it('should invoke callback on button click', async () => {
    const controlValue = new Decimal(8.558);
    const handleClick = jest.fn();
    render(
      <TickerControl
        value={controlValue}
        onClick={handleClick}
        buttonType={ButtonType.buy}
      />,
    );
    const user = userEvent.setup();
    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toBeCalled();
  });
});
