import classNames from 'classnames';

import classes from './TableHeader.module.scss';
import { tableOrder } from '../../../Config/Data';
import SortMethod from '../../../Types/SortMethod';
import TableRow from '../../../Types/TableRow';

type TableHeaderProps = {
  headerConfig: Record<TableRow, string>;
  onColumnClick: (columnLabel: TableRow) => void;
  sortField: TableRow;
  sortMethod: SortMethod;
};

const TableHeader = ({
  headerConfig,
  onColumnClick,
  sortField,
  sortMethod,
}: TableHeaderProps): JSX.Element => {
  const headerCellClassName = (cellSortField: TableRow) =>
    classNames(classes['table__header-cell'], {
      [classes['table__header-cell_sort-up']]:
        cellSortField === sortField && sortMethod === SortMethod.up,
      [classes['table__header-cell_sort-down']]:
        cellSortField === sortField && sortMethod === SortMethod.down,
    });

  return (
    <thead className={classes.table__header}>
      <tr>
        {tableOrder.map((columnLabel) => (
          <th
            key={columnLabel}
            className={headerCellClassName(columnLabel)}
            onClick={() => onColumnClick(columnLabel)}
          >
            {headerConfig[columnLabel]}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
