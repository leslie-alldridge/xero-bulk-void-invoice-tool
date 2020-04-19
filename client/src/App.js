import React from 'react';
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from 'react-router-dom';
import './App.css';
import { PageHeader } from './components/PageHeader';
import { Void } from './components/Void';
import { About } from './components/About';
import { Help } from './components/Help';
import { Auth } from './components/Auth';

import { GlobalProvider } from './context/GlobalState';

function App() {
  let location = useLocation();
  let history = useHistory();
  return (
    <GlobalProvider>
      <PageHeader currentPath={location.pathname} />
      <Switch>
        <Redirect exact from="/" to="/void" />
        <Route path="/void">
          <Void />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/help">
          <Help />
        </Route>
        <Route path="/callback">
          <Auth history={history} search={location.search} />
        </Route>
      </Switch>
    </GlobalProvider>
  );
}

export default App;
