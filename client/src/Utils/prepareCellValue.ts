import Decimal from 'decimal.js';

import { ClientPlaceOrder } from '../Models/ClientMessages';

const prepareCellValue = (
  cellValue: ClientPlaceOrder[keyof ClientPlaceOrder],
): string => {
  switch (true) {
    case typeof cellValue === 'string':
      return cellValue as string;

    case cellValue instanceof Date:
      return (cellValue as Date).toLocaleString('ru-RU');

    case cellValue instanceof Decimal:
      return (cellValue as Decimal).toFixed(5).toString();

    default:
      return cellValue === null ? '-' : cellValue.toString();
  }
};

export default prepareCellValue;
