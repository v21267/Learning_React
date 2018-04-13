import * as React from 'react';
import { NavLink } from 'react-router-dom';

export class AppTitle extends React.Component<{}, {}> {
  public render()
  {
    return <nav className="navbar navbar-expand navbar-dark">
      <span className="navbar-brand">
        <img src="/img/Header.png" alt="Venvito" />
      </span>

      <div className="separator">&nbsp;</div>

      <div className="main-menu">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <NavLink to={'/activities'} className="nav-link" activeClassName='link-active'>
              <span className="fas fa-tty fa-lg"></span>
              Activities
             </NavLink>
          </li>
          <li className="nav-item"  >
            <NavLink to={'/dashboard'} className="nav-link" activeClassName='link-active'>
              <span className="fas fa-chart-bar fa-lg"></span>
              Dashboard
             </NavLink>
          </li >
        </ul >
      </div >
        </nav >
          ;
  }
}
