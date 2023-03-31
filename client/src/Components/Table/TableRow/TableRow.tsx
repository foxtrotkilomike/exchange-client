import classes from './TableRow.module.scss';
import TTableRow from '../../../Types/TableRow';

type TableRowProps = {
  row: TTableRow;
};

const TableRow = ({ row }: TableRowProps): JSX.Element => {
  const prepareCellValue = (cellValue: TTableRow[keyof TTableRow]) => {
    switch (typeof cellValue) {
      case 'number':
        return cellValue;

      default:
        return cellValue.toString();
    }
  };

  return (
    <tr className={classes.table__row}>
      {Object.entries(row).map(([cellId, cellValue]) => (
        <td key={cellId} className={classes['table__row-cell']}>
          {prepareCellValue(cellValue)}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
