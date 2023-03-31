import Decimal from 'decimal.js';

import { Instrument, OrderSide, OrderStatus } from '../Enums';

interface TableRow {
  id: number;
  creationTime: Date;
  changeTime: Date;
  status: OrderStatus;
  side: OrderSide;
  price: Decimal;
  amount: Decimal;
  instrument: Instrument;
}

export default TableRow;
