import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Decimal from 'decimal.js';
import { Line } from 'react-chartjs-2';

import { Instrument } from '../../Config/Enums';
import prepareChartData from '../../Utils/prepareChartData';
import prepareChartOptions from '../../Utils/prepareChartOptions';

type ChartProps = {
  sellingRate: Decimal[];
  purchaseRate: Decimal[];
  chosenInstrument: Instrument;
  timestamps: string[];
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Chart = ({
  sellingRate,
  purchaseRate,
  chosenInstrument,
  timestamps,
}: ChartProps): JSX.Element => {
  const options = prepareChartOptions(chosenInstrument);
  const data = prepareChartData(sellingRate, purchaseRate, timestamps);

  return <Line options={options} data={data} />;
};

export default Chart;
