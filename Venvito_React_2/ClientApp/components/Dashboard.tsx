import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export default class Dashboard extends React.Component<RouteComponentProps<{}>, {}> {
  public render()
  {
    return <div>
      <h1>Dashboard!</h1>
    </div>;
  }
}
