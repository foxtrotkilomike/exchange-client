import Decimal from 'decimal.js';

import { Instrument, OrderSide, OrderStatus } from '../Enums';
import { Option } from '../Types/Option';
import TableRow from '../Types/TableRow';

const instrumentOptions: Option[] = [
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

const tableHeader: Record<keyof TableRow, string> = {
  id: 'Id',
  creationTime: 'Creation Time',
  changeTime: 'Change time',
  status: 'Status',
  side: 'Side',
  price: 'Price',
  amount: 'Amount',
  instrument: 'Instrument',
};

const mockTable: TableRow[] = [
  {
    id: 1,
    creationTime: new Date(),
    changeTime: new Date(),
    status: OrderStatus.active,
    side: OrderSide.buy,
    price: new Decimal(2342),
    amount: new Decimal(10),
    instrument: Instrument.eur_rub,
  },
  {
    id: 2,
    creationTime: new Date(),
    changeTime: new Date(),
    status: OrderStatus.active,
    side: OrderSide.buy,
    price: new Decimal(2342.2342),
    amount: new Decimal(10),
    instrument: Instrument.eur_rub,
  },
  {
    id: 3,
    creationTime: new Date(),
    changeTime: new Date(),
    status: OrderStatus.active,
    side: OrderSide.buy,
    price: new Decimal(2342),
    amount: new Decimal(10),
    instrument: Instrument.eur_rub,
  },
  {
    id: 4,
    creationTime: new Date(),
    changeTime: new Date(),
    status: OrderStatus.active,
    side: OrderSide.buy,
    price: new Decimal(2342),
    amount: new Decimal(10),
    instrument: Instrument.eur_rub,
  },
];

export { instrumentOptions, tableHeader, mockTable };
