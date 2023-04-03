import classes from './TableHeader.module.scss';
import { tableOrder } from '../../../Config/Data';
import TableRow from '../../../Types/TableRow';

type TableHeaderProps = {
  headerConfig: Record<TableRow, string>;
};

const TableHeader = ({ headerConfig }: TableHeaderProps): JSX.Element => {
  return (
    <thead className={classes.table__header}>
      <tr>
        {tableOrder.map((columnLabel) => (
          <th key={columnLabel} className={classes['table__header-cell']}>
            {headerConfig[columnLabel]}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
