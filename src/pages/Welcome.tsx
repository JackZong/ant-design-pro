import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { useAuth } from '@/contexts/AuthContext';

interface InfoCardProps {
  title: string;
  index: number;
  desc: string;
  href: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, index, desc, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={title}>
    <Card hoverable size="small">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#1677ff] text-base font-bold text-white">
          {index}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="mb-1 mt-0 text-sm font-semibold">{title}</h4>
          <p className="mb-0 line-clamp-2 text-xs text-zinc-500">{desc}</p>
        </div>
      </div>
    </Card>
  </a>
);

const infoCards = [
  {
    index: 1,
    href: 'https://vite.dev',
    titleId: 'pages.welcome.infoCard.vite.title',
    titleDefault: 'Learn Vite',
    descId: 'pages.welcome.infoCard.vite.desc',
    descDefault:
      'Vite is the next generation frontend tooling with instant server start and optimized builds.',
  },
  {
    index: 2,
    href: 'https://ant.design',
    titleId: 'pages.welcome.infoCard.antd.title',
    titleDefault: 'Learn Ant Design',
    descId: 'pages.welcome.infoCard.antd.desc',
    descDefault:
      'antd is a React UI component library based on the Ant Design system, mainly for enterprise-level mid-end products.',
  },
  {
    index: 3,
    href: 'https://procomponents.ant.design',
    titleId: 'pages.welcome.infoCard.procomponents.title',
    titleDefault: 'Learn Pro Components',
    descId: 'pages.welcome.infoCard.procomponents.desc',
    descDefault:
      'ProComponents provides higher-abstraction template components on top of Ant Design, with one-component-one-page philosophy.',
  },
] as const;

const Welcome: React.FC = () => {
  const intl = useIntl();
  const { settings } = useAuth();
  const isDark = settings?.navTheme === 'realDark';

  return (
    <PageContainer
      title={intl.formatMessage(
        {
          id: 'pages.welcome.celebrationTitle',
          defaultMessage: '欢迎使用 Ant Design Pro {v6}',
        },
        {
          v6: (
            <span key="v6" className="welcome-gradient-title">
              V6
            </span>
          ),
        },
      )}
    >
      <div
        data-theme={isDark ? 'dark' : 'light'}
        className="flex flex-col gap-6 md:flex-row"
      >
        <div className="min-w-0 md:flex-[2]">
          <Card>
            <p>
              {intl.formatMessage({
                id: 'pages.welcome.alertMessage',
                defaultMessage:
                  'Faster and stronger heavy-duty components have been released.',
              })}
            </p>
            <p className="mb-0 text-zinc-500">
              本项目已迁移至 Vite + React Router，保留登录、布局与权限示例。
            </p>
          </Card>
        </div>
        <div className="flex flex-1 flex-col gap-4">
          {infoCards.map((card) => (
            <InfoCard
              key={card.href}
              index={card.index}
              href={card.href}
              title={intl.formatMessage({
                id: card.titleId,
                defaultMessage: card.titleDefault,
              })}
              desc={intl.formatMessage({
                id: card.descId,
                defaultMessage: card.descDefault,
              })}
            />
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default Welcome;
