export interface CounterState {
  count: number;
}

export const INCREMENT_COUNT = "INCREMENT_COUNT";
type INCREMENT_COUNT = typeof INCREMENT_COUNT;

interface IncrementCountAction/*  extends React.MouseEvent */ {
  type: INCREMENT_COUNT;
  // payload:
}

export const DECREMENT_COUNT = "DECREMENT_COUNT";
type DECREMENT_COUNT = typeof DECREMENT_COUNT;

interface DecrementCountAction {
  type: DECREMENT_COUNT;
}

export type CounterActionType = IncrementCountAction | DecrementCountAction;
