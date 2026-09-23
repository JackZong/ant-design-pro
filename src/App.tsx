import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import React from 'react';
import { ErrorBoundary } from '@/components';
import { AntdAppApiBridge } from '@/components/AntdAppApiBridge';
import { useLocale } from '@/locales';
import defaultSettings from '../config/defaultSettings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const antdLocales = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

export default function App({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={antdLocales[locale]}
        variant="filled"
        theme={{
          token: {
            fontFamily: 'AlibabaSans, sans-serif',
            colorPrimary: defaultSettings.colorPrimary,
          },
        }}
      >
        <AntdApp>
          <AntdAppApiBridge>
            <ErrorBoundary>{children}</ErrorBoundary>
          </AntdAppApiBridge>
        </AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
