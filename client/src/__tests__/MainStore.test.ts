import { waitFor } from '@testing-library/react';
import Decimal from 'decimal.js';

import { Instrument, OrderSide, OrderStatus } from '../Config/Enums';
import { ClientPlaceOrder, PlaceOrder } from '../Models/ClientMessages';
import MainStore from '../Store/MainStore';

let connection = new MainStore();
jest.setTimeout(11000);

beforeEach(() => {
  connection.destroy();
  connection = new MainStore();
});

describe('MainStore', () => {
  it('should be able to call new() on MainStore', () => {
    expect(connection).toBeTruthy();
  });

  it('should be able to choose instrument type', () => {
    connection.setInstrument(Instrument.eur_usd);
    expect(connection.chosenInstrument).toBe(Instrument.eur_usd);
    connection.setInstrument(Instrument.usd_rub);
    expect(connection.chosenInstrument).toBe(Instrument.usd_rub);
  });

  it('should be able to set instrument type', () => {
    expect(connection.instrumentAmount).toBe(null);
    connection.setInstrumentAmount(new Decimal(123));
    expect(connection.instrumentAmount?.toNumber()).toBe(123);
  });

  it('should subscribe to quotes', async () => {
    expect(connection.subscriptionId).not.toBeTruthy();
    await waitFor(() => expect(connection.subscriptionId).toBeTruthy());
  });

  it('should unsubscribe on destroy', async () => {
    await waitFor(() => {
      connection.destroy();
      expect(connection.subscriptionId).toBeNull();
    });
  });

  it('should disconnect on destroy', async () => {
    await waitFor(() => {
      connection.destroy();
      expect(connection.isValidConnection).toBe(false);
    });
  });

  it('should have sellingRate after construction & subscription', async () => {
    expect(connection.sellingRate.length).toBe(0);
    await waitFor(
      () => expect(connection.sellingRate.length).toBeGreaterThan(0),
      { timeout: 4000 },
    );
  });

  it('should be able to place order', async () => {
    const mockOrder: Pick<PlaceOrder, 'side' | 'amount'> = {
      side: OrderSide.sell,
      amount: new Decimal(123),
    };
    let orders, orderId, order: ClientPlaceOrder;

    await waitFor(
      () => {
        connection.placeOrder(mockOrder);
        orders = Object.entries(connection.orders);
        orderId = orders[0][0];
        order = orders[0][1];
        expect(orderId).not.toBe(undefined);
        expect(order.status).toBe(OrderStatus.active);
      },
      { timeout: 4000 },
    );
    await waitFor(
      () => {
        expect([OrderStatus.filled, OrderStatus.rejected]).toContain(
          order.status,
        );
      },
      { timeout: 7000 },
    );
  });

  it('should be able to cancel order', async () => {
    const mockOrder: Pick<PlaceOrder, 'side' | 'amount'> = {
      side: OrderSide.sell,
      amount: new Decimal(123),
    };
    let orders, orderId, order: ClientPlaceOrder;

    await waitFor(
      () => {
        connection.placeOrder(mockOrder);
        orders = Object.entries(connection.orders);
        orderId = orders[0][0];
        order = orders[0][1];
        connection.cancelOrder(orderId);
      },
      { timeout: 4000 },
    );
    await waitFor(
      () => {
        expect(order.status).toBe(OrderStatus.cancelled);
      },
      { timeout: 7000 },
    );
  });
});
