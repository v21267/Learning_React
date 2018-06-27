import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as MetricsDataStore from '../store/MetricsDataHandler';
import { MetricsDataState } from '../store/MetricsDataHandler';
import { MetricsData } from '../MetricsData';
import DateSwitcher from './DateSwitcher';
import ActivityRow from './ActivityRow';

// At runtime, Redux will merge together...
export type MetricsDataProps =
  MetricsDataState                          // ... state we've requested from the Redux store
  & typeof MetricsDataStore.actionCreators  // ... plus action creators we've requested
  & RouteComponentProps<{}>;

export class Activities extends React.Component<MetricsDataProps, {}>
{
  public render()
  {
    const body =
      (this.props.data.length == 0 ?

        <p><em>Loading...</em></p> :

        <table className='table pt-0 activities-table'>
          <tbody>
            {this.props.data.map(md =>
              <ActivityRow key={md.code} {...md}></ActivityRow>
            )}
          </tbody>
        </table >
      );

    return <div>
      <DateSwitcher />
      {body}
    </div>;
  }

  static mapStateToProps = (state: ApplicationState) =>  
  {
    return state.metricsData;
  }
}


// Wire up the React component to the Redux store
export default connect(
  Activities.mapStateToProps,        // Selects which state properties are merged into the component's props
  MetricsDataStore.actionCreators    // Selects which action creators are merged into the component's props
)(Activities) as typeof Activities;
