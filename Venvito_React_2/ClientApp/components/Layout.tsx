import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { AppTitle } from './AppTitle';

export class Layout extends React.Component<{}, {}>
{
  public render()
  {
    return <div className="app-root">
      <MuiThemeProvider muiTheme={getMuiTheme({userAgent: 'all'})}>
        <div className="app">
          <AppTitle></AppTitle>
          {this.props.children}
        </div>
      </MuiThemeProvider>
    </div>;
  }
}
