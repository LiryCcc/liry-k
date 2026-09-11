import { useId, useState } from 'react';

const COUNTER_LABEL = 'Counter';
const DECREASE_LABEL = 'Decrease counter';
const DECREASE_SYMBOL = '−';
const INCREASE_LABEL = 'Increase counter';
const INCREASE_SYMBOL = '+';
const PAGE_DESCRIPTION = 'This counter is rendered on the server and hydrated in the browser.';
const PAGE_SECTION = 'Home';
const PAGE_TITLE = 'Streaming SSR counter';

const CounterPage = () => {
  const [count, setCount] = useState(0);
  const id = useId();

  return (
    <section className='page-card'>
      <span className='eyebrow'>{PAGE_SECTION}</span>
      <h1>{PAGE_TITLE}</h1>
      <p>{PAGE_DESCRIPTION}</p>
      <div aria-labelledby={id} className='counter'>
        <span id={id}>{COUNTER_LABEL}</span>
        <button aria-label={DECREASE_LABEL} onClick={() => setCount((current) => current - 1)} type='button'>
          {DECREASE_SYMBOL}
        </button>
        <output aria-live='polite'>{count}</output>
        <button aria-label={INCREASE_LABEL} onClick={() => setCount((current) => current + 1)} type='button'>
          {INCREASE_SYMBOL}
        </button>
      </div>
    </section>
  );
};

export default CounterPage;
