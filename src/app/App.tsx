import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'states';
import { Game } from 'components/game';

import './reset.css';
import './App.css';

export const App = () => {
  return (
    <Provider store={store}>
      <Game></Game>
    </Provider>
  );
};
