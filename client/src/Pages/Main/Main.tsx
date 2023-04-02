import Table from '../../Components/Table';
import Ticker from '../../Components/Ticker';
import Wrapper from '../../Components/Wrapper';
import { useLocalStore } from '../../Hooks/useLocalStore';
import MainStore from '../../Store/MainStore';

const Main = (): JSX.Element => {
  const mainStore = useLocalStore(() => new MainStore());

  return (
    <Wrapper main growing centered outer>
      <Ticker store={mainStore} />
      <Table />
    </Wrapper>
  );
};

export default Main;
