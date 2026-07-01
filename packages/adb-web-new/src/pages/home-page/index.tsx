import { useTranslation } from '@/i18n/use-translation.js';
import { Link, Text } from '@fluentui/react-components';
import { Link as RouterLink } from '@tanstack/react-router';

const adbDocUrl = 'https://developer.android.com/studio/command-line/adb';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Text as='h1' size={700} weight='semibold'>
        {t('home.title')}
      </Text>
      <Text as='p'>{t('home.desc')}</Text>
      <Text as='p'>
        <RouterLink to='/'>{t('nav.home')}</RouterLink>
      </Text>
      <Text as='p'>
        <Link href={adbDocUrl}>{t('ui.adbDocLabel')}</Link>
      </Text>
    </div>
  );
};

export const HomePageComponent = HomePage;
