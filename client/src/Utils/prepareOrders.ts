import { ClientPlaceOrder } from '../Models/ClientMessages';
import TableRowT from '../Types/TableRow';

const prepareOrders = (
  ordersMap: Record<string, ClientPlaceOrder>,
  sortField: TableRowT = 'creationTime',
): ClientPlaceOrder[] => {
  const orders = Object.values(ordersMap);
  switch (sortField) {
    case 'creationTime':
      return orders.sort((a, b) => {
        return a[sortField].valueOf() - b[sortField].valueOf();
      });

    default:
      return orders;
  }
};

export default prepareOrders;
