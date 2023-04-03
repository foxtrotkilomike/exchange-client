import React from 'react';

import '../Styles/main.scss';
import './App.module.scss';
import { Toaster } from 'react-hot-toast';

import Main from '../Pages/Main';

function App() {
  return (
    <div className="app">
      <Main />
      <Toaster />
    </div>
  );
}

export default App;
