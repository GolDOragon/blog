import {
  CounterActionType,
  CounterState,
  DECREMENT_COUNT,
  INCREMENT_COUNT
} from "../types/counterTypes";

const initialCounterState: CounterState = {
  count: 0,
};

const counterReducer = (
  state = initialCounterState,
  action: CounterActionType
): CounterState => {
  switch (action.type) {
    case DECREMENT_COUNT:
      return {
        ...state,
        count: state.count - 1,
      };
    case INCREMENT_COUNT:
      return {
        ...state,
        count: state.count + 1,
      };
    default:
      return state;
  }
};

export default counterReducer;
