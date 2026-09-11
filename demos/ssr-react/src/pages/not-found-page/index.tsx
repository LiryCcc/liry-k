import { Link } from '@tanstack/react-router';

const BACK_HOME = 'Back to home';
const PAGE_DESCRIPTION = 'The requested page does not exist.';
const PAGE_SECTION = '404';
const PAGE_TITLE = 'Page not found';

const NotFoundPage = () => (
  <section className='page-card'>
    <span className='eyebrow'>{PAGE_SECTION}</span>
    <h1>{PAGE_TITLE}</h1>
    <p>{PAGE_DESCRIPTION}</p>
    <Link className='action-link' to='/'>
      {BACK_HOME}
    </Link>
  </section>
);

export default NotFoundPage;
