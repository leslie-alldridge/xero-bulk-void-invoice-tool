import React from 'react';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
import './App.css';
import { PageHeader } from './components/common/PageHeader';
import { Void } from './components/Void';
import { About } from './components/About';
import { Help } from './components/Help';
import { Auth } from './components/Auth';
import { NotFound } from './components/common/NotFound';

function App() {
  let location = useLocation();
  let history = useHistory();

  return (
    <div>
      <PageHeader currentPath={location.pathname} />
      <Switch>
        {/* <Redirect exact from='/' to='/void' /> */}
        <Route
          exact
          path='/'
          component={() => {
            window.location.href = 'https://bulkvoidxero.herokuapp.com/void';
            return null;
          }}
        ></Route>
        <Route path='/void'>
          <Void />
        </Route>
        <Route path='/about'>
          <About />
        </Route>
        <Route path='/help'>
          <Help />
        </Route>
        <Route path='/auth'>
          <Auth history={history} search={location.search} />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
