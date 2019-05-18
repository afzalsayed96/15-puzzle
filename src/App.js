import React from 'react';
import './App.css';
import { Provider } from "react-redux";
import store from './store';
import Game from './Game';


const App = () => (
  <Provider store={store}>
      <div>
        <Game />
      </div>
  </Provider>
);

export default App;
