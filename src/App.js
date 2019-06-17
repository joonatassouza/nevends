import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Body from './components/Body';
import { Provider } from 'react-redux';
import store from './store';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Header />
          <Body />
        </BrowserRouter>
        <NotificationContainer />
      </Provider>
    </div>
  );
}

export default App;
