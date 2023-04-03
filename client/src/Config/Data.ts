import { Instrument } from './Enums';
import { Option } from '../Types/Option';
import TableRow from '../Types/TableRow';

const instrumentOptions: Option[] = [
  {
    value: Instrument.eur_rub,
    label: 'EUR/RUB',
  },
  {
    value: Instrument.eur_usd,
    label: 'EUR/USD',
  },
  {
    value: Instrument.usd_rub,
    label: 'USD/RUB',
  },
];

const tableOrder: TableRow[] = [
  'orderId',
  'creationTime',
  'changeTime',
  'status',
  'side',
  'price',
  'amount',
  'instrument',
];

const tableHeader: Record<TableRow, string> = {
  orderId: 'Id',
  creationTime: 'Creation Time',
  changeTime: 'Change time',
  status: 'Status',
  side: 'Side',
  price: 'Price',
  amount: 'Amount',
  instrument: 'Instrument',
};

export { instrumentOptions, tableHeader, tableOrder };
