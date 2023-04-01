import React, { useEffect } from 'react';

import Table from '../../Components/Table';
import Ticker from '../../Components/Ticker';
import Wrapper from '../../Components/Wrapper';
import WSConnector from '../../WSClient';

const Main = (): JSX.Element => {
  useEffect(() => {
    const connection = new WSConnector();
    connection.connect();

    return () => connection.disconnect();
  }, []);

  return (
    <Wrapper main growing centered outer>
      <Ticker />
      <Table />
    </Wrapper>
  );
};

export default React.memo(Main);
