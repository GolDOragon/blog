import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const [num, setNum] = useState(0);

  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault();
  //   setNum(num + 1);
  // };
  return (
    <div>
      <button onClick={setNum(num + 1)}>+1</button>
      {num}
      <h1>Hello ts and react!</h1>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
