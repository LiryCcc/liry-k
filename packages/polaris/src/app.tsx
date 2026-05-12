import { DevToolsFab } from './dev-tools-fab.js';

const App = () => {
  const greeting = 'Hello World';
  return (
    <>
      <div>{greeting}</div>
      <DevToolsFab />
    </>
  );
};

export default App;
