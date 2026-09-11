const PAGE_DESCRIPTION = 'A compact reference implementation for production-oriented streaming server-side rendering.';
const PAGE_SECTION = 'About';
const PAGE_TITLE = 'About this project';
const STACK_ITEMS = [
  'React 19 for component rendering and hydration',
  'Vite 8 for development transforms and production bundles',
  'TanStack Router for type-safe isomorphic routing',
  'Hono and Node.js for HTTP serving and streaming responses',
  'Zod for validating data at runtime boundaries',
  'Normalize.css and application styles inlined in the document head'
] as const;
const STACK_TITLE = 'Technology stack';

const AboutPage = () => (
  <section className='page-card'>
    <span className='eyebrow'>{PAGE_SECTION}</span>
    <h1>{PAGE_TITLE}</h1>
    <p>{PAGE_DESCRIPTION}</p>
    <h2>{STACK_TITLE}</h2>
    <ul className='stack-list'>
      {STACK_ITEMS.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </section>
);

export default AboutPage;
