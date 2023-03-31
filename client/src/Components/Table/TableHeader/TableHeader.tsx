import classes from './TableHeader.module.scss';
import TableRow from '../../../Types/TableRow';

type TableHeaderProps = {
  headerConfig: Record<keyof TableRow, string>;
};

const TableHeader = ({ headerConfig }: TableHeaderProps): JSX.Element => {
  return (
    <thead className={classes.table__header}>
      <tr>
        {Object.entries(headerConfig).map(([columnId, columnLabel]) => (
          <th key={columnId} className={classes['table__header-cell']}>
            {columnLabel}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
