import { CounterActionType, DECREMENT_COUNT, INCREMENT_COUNT } from "../types/counterTypes";

export const incrementCount = (): CounterActionType => {
  return {
    type: INCREMENT_COUNT
  }
}
export const decrementCount = (): CounterActionType => {
  return {
    type: DECREMENT_COUNT
  }
}
