import React from "react";
import { connect, ConnectedProps } from "react-redux";
import {
  decrementCount,
  incrementCount
} from "../../store/actions/counterActions";
import store from "../../store/store";

const mapState = (state = store.getState()) => ({
  count: state.counter.count,
});
const mapDispatch = {
  increment: incrementCount,
  decrement: decrementCount,
};
const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;


const Counter = (props: Props) => {
  return (
    <div>
      Count: {props.count}
      <button onClick={props.increment}>+1</button>
      <button onClick={props.decrement}>-1</button>
    </div>
  );
};

export default connector(Counter);
