import { observer } from 'mobx-react-lite';

import Chart from '../../Components/Chart';
import Table from '../../Components/Table';
import Ticker from '../../Components/Ticker';
import Wrapper from '../../Components/Wrapper';
import { useLocalStore } from '../../Hooks/useLocalStore';
import MainStore from '../../Store/MainStore';

const Main = (): JSX.Element => {
  const mainStore = useLocalStore(() => new MainStore());
  const { sellingRate, purchaseRate, chosenInstrument, timestamps } = mainStore;

  return (
    <Wrapper main growing centered outer>
      <Ticker store={mainStore} />
      <Chart
        sellingRate={sellingRate}
        purchaseRate={purchaseRate}
        chosenInstrument={chosenInstrument}
        timestamps={timestamps}
      />
      <Table store={mainStore} />
    </Wrapper>
  );
};

export default observer(Main);
