import { Action, Reducer } from 'redux';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.
export interface CurrentDateState
{
  currentDate: number;
}

const initialState: CurrentDateState = { currentDate: new Date().valueOf() };

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.
interface SetCurrentDateAction
{
  type: 'SET_CURRENT_DATE';
  newDate: Date;
}


// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SetCurrentDateAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
  setCurrentDate: (newDate: Date) => <SetCurrentDateAction>{ type: 'SET_CURRENT_DATE', newDate: newDate }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
export const reducer: Reducer<CurrentDateState> =
  (state: CurrentDateState, incomingAction: Action) =>
  {
    const action = incomingAction as SetCurrentDateAction;
    switch (action.type)
    {
      case 'SET_CURRENT_DATE':
        return { currentDate: action.newDate.valueOf() } as CurrentDateState;
      default:
        // The following line guarantees that every action in the KnownAction union has been covered by a case above
        const exhaustiveCheck: never = action as never;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
      return state || initialState;
  };
