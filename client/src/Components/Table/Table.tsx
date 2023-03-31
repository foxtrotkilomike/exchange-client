import classes from './Table.module.scss';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { mockTable, tableHeader } from '../../Config/Data';

const Table = (): JSX.Element => {
  const tableRows = mockTable.map((row) => <TableRow row={row} key={row.id} />);

  return (
    <table className={classes.table}>
      <TableHeader headerConfig={tableHeader} />
      <tbody>{tableRows}</tbody>
    </table>
  );
};

export default Table;
