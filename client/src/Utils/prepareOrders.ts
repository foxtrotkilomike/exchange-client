import { ClientPlaceOrder } from '../Models/ClientMessages';
import SortMethod from '../Types/SortMethod';
import TableRowT from '../Types/TableRow';

const prepareOrders = (
  ordersMap: Record<string, ClientPlaceOrder>,
  sortField: TableRowT = 'creationTime',
  sortMethod: SortMethod,
): ClientPlaceOrder[] => {
  const orders = Object.values(ordersMap);
  switch (sortField) {
    case 'creationTime':
    case 'changeTime':
      return orders.sort((a, b) => {
        if (a[sortField] && b[sortField]) {
          return sortMethod === SortMethod.up
            ? (a[sortField] as Date).valueOf() -
                (b[sortField] as Date).valueOf()
            : (b[sortField] as Date).valueOf() -
                (a[sortField] as Date).valueOf();
        }

        return 0;
      });

    case 'orderId':
    case 'price':
    case 'amount':
      if (sortMethod === SortMethod.up) {
        return orders.sort((a, b) => {
          return +a[sortField] > +b[sortField] ? 1 : -1;
        });
      } else {
        return orders.sort((a, b) => {
          return +a[sortField] <= +b[sortField] ? 1 : -1;
        });
      }

    case 'status':
    case 'side':
    case 'instrument':
      if (sortMethod === SortMethod.up) {
        return orders.sort((a, b) => {
          return a[sortField] > b[sortField] ? 1 : -1;
        });
      } else {
        return orders.sort((a, b) => {
          return a[sortField] <= b[sortField] ? 1 : -1;
        });
      }

    default:
      return orders;
  }
};

export default prepareOrders;
