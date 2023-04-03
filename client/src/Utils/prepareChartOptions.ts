import { Instrument } from '../Config/Enums';

const prepareChartOptions = (title: string | Instrument) => {
  return {
    responsive: true,
    animation: {
      duration: 500,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
        padding: {
          top: 10,
          bottom: 10,
        },
      },
    },
  };
};

export default prepareChartOptions;
