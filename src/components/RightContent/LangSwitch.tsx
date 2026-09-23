import { GlobalOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import React from 'react';
import { type LocaleType, useLocale } from '@/locales';
import HeaderDropdown from '../HeaderDropdown';

const localeLabels: Record<LocaleType, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English',
};

export const LangSwitch: React.FC = () => {
  const { locale, setLocale } = useLocale();

  const items: MenuProps['items'] = (
    Object.keys(localeLabels) as LocaleType[]
  ).map((key) => ({
    key,
    label: localeLabels[key],
    onClick: () => setLocale(key),
  }));

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [locale],
        items,
      }}
      placement="bottomRight"
    >
      <span style={{ cursor: 'pointer', padding: '0 8px' }}>
        <GlobalOutlined />
      </span>
    </HeaderDropdown>
  );
};
