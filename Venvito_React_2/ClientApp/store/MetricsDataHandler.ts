import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { MetricsData } from '../MetricsData';
import { VenvitoService } from '../VenvitoService';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.
export interface MetricsDataState
{
  currentDate: number;
  data: MetricsData[];
}

const initialState: MetricsDataState = {
  currentDate: VenvitoService.initialDate.valueOf(),
  data: new Array()
};

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.
interface SetCurrentDateAction
{
  type: 'SET_CURRENT_DATE';
  newDate: Date;
}

interface SetMetricsDataAction
{
  type: 'SET_METRICS_DATA';
  data: MetricsData[];
}

interface UpdateMetricsDataAction
{
  type: 'UPDATE_METRICS_DATA';
  md: MetricsData;
}


// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SetCurrentDateAction | SetMetricsDataAction | UpdateMetricsDataAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
  setCurrentDate: (newDate: Date): AppThunkAction <KnownAction> => (dispatch, getState) =>
  {
    dispatch({ type: 'SET_CURRENT_DATE', newDate: newDate });
  },

  setMetricsData: (data: MetricsData[]): AppThunkAction<KnownAction> => (dispatch, getState) =>
  {
    dispatch({ type: 'SET_METRICS_DATA', data: data });
  },

  updateMetricsData: (md: MetricsData): AppThunkAction<KnownAction> => (dispatch, getState) =>
  {
    dispatch({ type: 'UPDATE_METRICS_DATA', md: md });
  }
};

export const setCurrentDateActionCreator = {
  setCurrentDate: actionCreators.setCurrentDate,
};

export const setMetricsDataActionCreator = {
  setMetricsData: actionCreators.setMetricsData,
};

export const updateMetricsDataActionCreator = {
  updateMetricsData: actionCreators.updateMetricsData,
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
export const reducer: Reducer<MetricsDataState> =
  (state: MetricsDataState, incomingAction: Action) =>
  {
    switch (incomingAction.type)
    {
      case 'SET_CURRENT_DATE':
        {
          const action = incomingAction as SetCurrentDateAction;
          return { ...state, currentDate: action.newDate.valueOf() } as MetricsDataState;
        }
      case 'SET_METRICS_DATA':
        {
          const action = incomingAction as SetMetricsDataAction;
          return { ...state, data: action.data } as MetricsDataState;
        }
      case 'UPDATE_METRICS_DATA':
        {
          const action = incomingAction as UpdateMetricsDataAction;
          const updatedData = state.data.map(md =>
          {
            if (md.code === action.md.code)
            {
              return { ...md, value: action.md.value }
            }
            return md;
          })
          return { ...state, data: updatedData };
        }
      default:
        // The following line guarantees that every action in the KnownAction union has been covered by a case above
        const exhaustiveCheck: never = incomingAction as never;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || initialState;
  };
