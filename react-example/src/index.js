import React from 'react';
import { render } from 'react-dom';
import App from './App';
import Provider from './Provider';
import createStore from './Lens/createStore'


const state = {
  user: {
    name: 'Gabriel'
  }
}


render(
  <Provider store={createStore(state)}>
    <App />
  </Provider>,
  document.getElementById('root')
)
