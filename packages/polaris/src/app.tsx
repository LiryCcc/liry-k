import { IS_TAURI } from './constant.js';
import { DevToolsFab } from './dev-tools-fab.js';

const App = () => {
  const greeting = 'Hello World';
  return (
    <>
      <div>{greeting}</div>
      {IS_TAURI && <DevToolsFab />}
    </>
  );
};

export default App;
