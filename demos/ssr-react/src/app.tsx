import { useId, useState } from 'react';
import { COUNTER_LABEL, DECREASE_SYMBOL, INCREASE_SYMBOL, PAGE_DESCRIPTION, PAGE_TITLE } from './ssr-constants.js';

const App = () => {
  const [count, setCount] = useState(0);
  const id = useId();

  return (
    <main className='app-shell'>
      <h1>{PAGE_TITLE}</h1>
      <p>{PAGE_DESCRIPTION}</p>
      <div aria-labelledby={id} className='counter'>
        <span id={id}>{COUNTER_LABEL}</span>
        <button aria-label='Decrease counter' onClick={() => setCount((current) => current - 1)} type='button'>
          {DECREASE_SYMBOL}
        </button>
        <output aria-live='polite'>{count}</output>
        <button aria-label='Increase counter' onClick={() => setCount((current) => current + 1)} type='button'>
          {INCREASE_SYMBOL}
        </button>
      </div>
    </main>
  );
};

export default App;
