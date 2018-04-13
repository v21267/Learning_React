import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Layout } from './components/Layout';
/*
import Home from './components/Home';
import FetchData from './components/FetchData';
import Counter from './components/Counter';
*/

import Activities from './components/Activities';
import Dashboard from './components/Dashboard';

/*
export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/counter' component={ Counter } />
    <Route path='/fetchdata/:startDateIndex?' component={ FetchData } />
</Layout>;
*/


export const routes = <Layout>
  <Switch>
    <Route path='/activities' component={Activities} />
    <Route path='/dashboard' component={Dashboard} />
    <Redirect to="/activities" />
  </Switch>
</Layout>;
