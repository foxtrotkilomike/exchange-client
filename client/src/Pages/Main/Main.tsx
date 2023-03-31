import Table from '../../Components/Table';
import Ticker from '../../Components/Ticker';
import Wrapper from '../../Components/Wrapper';

const Main = (): JSX.Element => {
  return (
    <Wrapper main growing centered outer>
      <Ticker />
      <Table />
    </Wrapper>
  );
};

export default Main;
