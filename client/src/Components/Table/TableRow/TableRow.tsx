import classes from './TableRow.module.scss';
import TTableRow from '../../../Types/TableRow';
import prepareCellValue from '../../../Utils/prepareCellValue';

type TableRowProps = {
  row: TTableRow;
};

const TableRow = ({ row }: TableRowProps): JSX.Element => {
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
