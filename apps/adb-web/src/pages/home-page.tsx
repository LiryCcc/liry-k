import { PageShell } from '@/components/page-shell';
import { strings } from '@/strings';
import { Link, Text } from '@fluentui/react-components';
import { useEffect } from 'react';

export const HomePage = () => {
  useEffect(() => {
    document.title = strings.home.documentTitle;
  }, []);

  return (
    <PageShell>
      <Text as='p'>
        {strings.home.introP1}{' '}
        <Link href={strings.home.linkYaWebadb} target='_blank' rel='noreferrer'>
          {strings.home.linkYaWebadbLabel}
        </Link>
      </Text>
      <Text as='p'>
        {strings.home.introP2}{' '}
        <Link href={strings.home.linkWebUsb} target='_blank' rel='noreferrer'>
          {strings.home.linkWebUsbLabel}
        </Link>
        {' · '}
        <Link href={strings.home.linkIssues} target='_blank' rel='noreferrer'>
          {strings.home.linkIssuesLabel}
        </Link>
      </Text>
      <Text as='p'>{strings.home.introP3}</Text>
      <ul>
        <li>
          <Link href={strings.home.linkWebadbJs} target='_blank' rel='noreferrer'>
            {strings.home.linkWebadbJsLabel}
          </Link>
        </li>
        <li>
          <Link href={strings.home.linkWebadbLiry} target='_blank' rel='noreferrer'>
            {strings.home.linkWebadbLiryLabel}
          </Link>
        </li>
      </ul>
    </PageShell>
  );
};
