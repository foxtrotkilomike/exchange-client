import classes from './TableRow.module.scss';
import { tableOrder } from '../../../Config/Data';
import { ClientPlaceOrder } from '../../../Models/ClientMessages';
import prepareCellValue from '../../../Utils/prepareCellValue';

type TableRowProps = {
  row: ClientPlaceOrder;
};

const TableRow = ({ row }: TableRowProps): JSX.Element => {
  return (
    <tr className={classes.table__row}>
      {tableOrder.map((cellKey) => (
        <td key={cellKey} className={classes['table__row-cell']}>
          {prepareCellValue(row[cellKey])}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
