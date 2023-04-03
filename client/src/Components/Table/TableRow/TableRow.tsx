import classNames from 'classnames';

import classes from './TableRow.module.scss';
import { tableOrder } from '../../../Config/Data';
import { OrderSide, OrderStatus } from '../../../Config/Enums';
import { ClientPlaceOrder } from '../../../Models/ClientMessages';
import TableRowT from '../../../Types/TableRow';
import prepareCellValue from '../../../Utils/prepareCellValue';

type TableRowProps = {
  row: ClientPlaceOrder;
  onOrderCancel: (orderId: string) => void;
};

const TableRow = ({ row, onOrderCancel }: TableRowProps): JSX.Element => {
  const shouldRenderCancelButton = row.status === OrderStatus.active;

  const cellClassName = (cellKey: TableRowT) =>
    classNames(classes['table__row-cell'], {
      [classes['table__row-cell_fail']]:
        cellKey === 'status' &&
        (row.status === OrderStatus.rejected ||
          row.status === OrderStatus.cancelled),
      [classes['table__row-cell_sell']]:
        cellKey === 'side' && row.side === OrderSide.sell,
      [classes['table__row-cell_success']]:
        cellKey === 'status' &&
        (row.status === OrderStatus.filled ||
          row.status === OrderStatus.active),
      [classes['table__row-cell_buy']]:
        cellKey === 'side' && row.side === OrderSide.buy,
    });

  return (
    <tr className={classes.table__row}>
      {tableOrder.map((cellKey) => (
        <td key={cellKey} className={cellClassName(cellKey)}>
          {prepareCellValue(row[cellKey])}
        </td>
      ))}
      <td className={classes['table__row-cell']}>
        {shouldRenderCancelButton && (
          <button
            className={classes['cancel-button']}
            onClick={() => onOrderCancel(row.orderId)}
          >
            Cancel
          </button>
        )}
      </td>
    </tr>
  );
};

export default TableRow;
