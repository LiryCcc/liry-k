import { useTranslation } from '@/i18n/use-translation.js';
import { info } from '@/utils/observability.js';
import { Button, Text } from '@fluentui/react-components';
import { ArrowLeftRegular } from '@fluentui/react-icons';
import { useNavigate } from '@tanstack/react-router';

const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div>
      <Text as='h1' size={700} weight='semibold'>
        {t('notFound.title')}
      </Text>
      <Text as='p'>{t('notFound.desc')}</Text>
      <Button
        appearance='primary'
        icon={<ArrowLeftRegular />}
        onClick={() => {
          info('nav.backHome');
          navigate({ to: '/' });
        }}
      >
        {t('notFound.backHome')}
      </Button>
    </div>
  );
};

export const NotFoundPageComponent = NotFoundPage;
export default NotFoundPageComponent;
