import React from 'react';

import '../Styles/main.scss';
import './App.module.scss';
import Ticker from '../Components/Ticker';
import Wrapper from '../Components/Wrapper';

function App() {
  return (
    <div className="app">
      <Wrapper>
        <Ticker />
      </Wrapper>
    </div>
  );
}

export default App;
