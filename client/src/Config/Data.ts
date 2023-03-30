import { Instrument } from '../Enums';
import { Option } from '../Types/Option';

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

export { instrumentOptions };
