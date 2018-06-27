import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Layout } from './components/Layout';

import Activities from './components/Activities';
import Dashboard from './components/Dashboard';

export const routes = <Layout>
  <Switch>
    <Route path='/activities' component={Activities} />
    <Route path='/dashboard' component={Dashboard} />
    <Redirect to="/activities" />
  </Switch>
</Layout>;
