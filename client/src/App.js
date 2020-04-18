import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import './App.css';
import { PageHeader } from './components/PageHeader';
import { Void } from './components/Void';
import { About } from './components/About';
import { Help } from './components/Help';

import { GlobalProvider } from './context/GlobalState';

function App() {
  let location = useLocation();
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
      </Switch>
    </GlobalProvider>
  );
}

export default App;
