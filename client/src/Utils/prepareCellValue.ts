import Decimal from 'decimal.js';

import TTableRow from '../Types/TableRow';

const prepareCellValue = (cellValue: TTableRow[keyof TTableRow]) => {
  switch (true) {
    case typeof cellValue === 'number':
      return cellValue as number;

    case cellValue instanceof Date:
      return (cellValue as Date).toLocaleString('ru-RU');

    case cellValue instanceof Decimal:
      return (cellValue as Decimal).toFixed(5).toString();

    default:
      return cellValue.toString();
  }
};

export default prepareCellValue;
