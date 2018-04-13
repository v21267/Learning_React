import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as MetricsDataStore from '../store/MetricsDataHandler';
import { MetricsDataState } from '../store/MetricsDataHandler';
import { DateSwitcher } from './DateSwitcher';

// At runtime, Redux will merge together...
export type MetricsDataProps =
  MetricsDataStore.MetricsDataState         // ... state we've requested from the Redux store
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
              <tr key={md.code} className="activity-row">
                <td>{md.code}</td>
                <td>{md.description}</td>
                <td>{md.type}</td>
                <td>{md.value}</td>
                <td>{md.color}</td>
                <td>{md.date}</td>
              </tr>
            )}
          </tbody>
        </table >
      );

    return <div>
      <DateSwitcher {...this.props} ></DateSwitcher>
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
