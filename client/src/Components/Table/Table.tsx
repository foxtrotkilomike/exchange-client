import { useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';

import classes from './Table.module.scss';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { tableHeader } from '../../Config/Data';
import MainStore from '../../Store/MainStore';
import SortMethod from '../../Types/SortMethod';
import TableRowT from '../../Types/TableRow';
import prepareOrders from '../../Utils/prepareOrders';

type TableProps = {
  store: MainStore;
};

type SortableField = TableRowT;

const Table = ({ store }: TableProps): JSX.Element => {
  const { orders: ordersMap, cancelOrder } = store;
  const [sortField, setSortField] = useState<SortableField>('creationTime');
  const [sortMethod, setSortMethod] = useState<SortMethod>(SortMethod.up);
  const [isEmptyTable, setIsEmptyTable] = useState(true);

  useEffect(() => {
    const ordersLength = Object.entries(ordersMap).length;
    setIsEmptyTable(ordersLength === 0);
  }, [ordersMap]);

  const handleHeaderColumnClick = (columnLabel: TableRowT) => {
    setSortField(columnLabel);
    setSortMethod((currentMethod) =>
      currentMethod === SortMethod.up ? SortMethod.down : SortMethod.up,
    );
  };

  const renderRows = (): JSX.Element[] => {
    const orders = prepareOrders(ordersMap, sortField, sortMethod);
    return orders.map((row) => (
      <TableRow row={row} onOrderCancel={cancelOrder} key={row.orderId} />
    ));
  };

  return (
    <>
      <table className={classes.table}>
        <TableHeader
          headerConfig={tableHeader}
          onColumnClick={handleHeaderColumnClick}
          sortField={sortField}
          sortMethod={sortMethod}
        />
        {!isEmptyTable && <tbody>{renderRows()}</tbody>}
      </table>
      {isEmptyTable && (
        <p className={classes['empty-table-message']}>No orders yet</p>
      )}
    </>
  );
};

export default observer(Table);
