import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { VenvitoService } from '../VenvitoService';
import { MetricsChart } from '../MetricsChart';
import { DashboardChart } from './DashboardChart';

export default class Dashboard extends React.Component<RouteComponentProps<{}>, DashboardState>
{
  constructor(props)
  {
    super(props);
    this.state = { dateRange: "7", charts: new Array() } as DashboardState;
  }

  componentWillMount()
  {
    // This method runs when the component is first added to the page
    this.loadCharts();
  }

  loadCharts()
  {
    VenvitoService.getMetricsChart(this.state.dateRange)
      .then(data => this.setState((prevState, props) => ({ charts: data })))
      .catch(error => console.log(error.response));
  }

  setDateRange(dateRange: string, e: any)
  {
    e.preventDefault();
    this.setState(
      () => ({ dateRange: dateRange }),
      () => { this.loadCharts(); });
  }


  public render()
  {
    return <div className="dashboard">
      <ul className="nav nav-tabs nav-fill">
        <li className="nav-item">
          <a onClick={(e) => this.setDateRange('7', e)} className={"nav-link" + (this.state.dateRange == '7' ? ' active' : '')} href="#">
            Last<br />7 Days
          </a>
        </li>
        <li className="nav-item">
          <a onClick={(e) => this.setDateRange('30', e)} className={"nav-link" + (this.state.dateRange == '30' ? ' active' : '')} href="#">
            Last<br />30 Days
          </a>
        </li>
        <li className="nav-item">
          <a onClick={(e) => this.setDateRange('M', e)} className={"nav-link" + (this.state.dateRange == 'M' ? ' active' : '')} href="#">
            This<br />Month
          </a>
        </li >
        <li className="nav-item">
          <a onClick={(e) => this.setDateRange('Q', e)} className={"nav-link" + (this.state.dateRange == 'Q' ? ' active' : '')} href="#">
            This<br />Quarter
          </a>
        </li >
      </ul >
      {this.state.charts.map(chart =>
        <div key={chart.code} className="chart-container">
          <DashboardChart  {...chart}></DashboardChart>
        </div>
      )}

    </div >
    ;
  }
}

interface DashboardState
{
  dateRange: string;
  charts: MetricsChart[];
}