import { ChartData } from 'chart.js/dist/types';
import Decimal from 'decimal.js';

const commonLineOptions = {
  tension: 0.4,
  borderWidth: 2,
  pointRadius: 2,
};

const prepareChartData = (
  sellingRate: Decimal[],
  purchaseRate: Decimal[],
  timestamps: string[],
): ChartData<'line', (number | null)[]> => {
  return {
    labels: timestamps,
    datasets: [
      {
        label: 'Selling Rate',
        data: sellingRate.map((rate) => parseFloat(rate.toFixed(3)) || null),
        borderColor: '#fe9393',
        backgroundColor: '#fe9393',
        ...commonLineOptions,
      },
      {
        label: 'Purchase Rate',
        data: purchaseRate.map((rate) => parseFloat(rate.toFixed(3)) || null),
        borderColor: '#7fe47f',
        backgroundColor: '#7fe47f',
        ...commonLineOptions,
      },
    ],
  };
};

export default prepareChartData;
