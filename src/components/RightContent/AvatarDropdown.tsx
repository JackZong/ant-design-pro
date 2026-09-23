import { LogoutOutlined, SkinOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Spin } from 'antd';
import React, { startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { outLogin } from '@/services/api';
import HeaderDropdown from '../HeaderDropdown';

type GlobalHeaderRightProps = {
  children?: React.ReactNode;
};

const menuItems: MenuProps['items'] = [
  {
    key: 'theme',
    icon: <SkinOutlined />,
    label: '主题设置',
  },
  {
    type: 'divider' as const,
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
  },
];

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({
  children,
}) => {
  const { currentUser, setCurrentUser, setSettingDrawerOpen } = useAuth();
  const navigate = useNavigate();

  const onMenuClick: MenuProps['onClick'] = (event) => {
    const { key } = event;
    if (key === 'logout') {
      startTransition(() => {
        setCurrentUser(undefined);
      });
      void (async () => {
        try {
          await outLogin();
        } catch {
          // Local logout has already cleared user state
        }
        const { search, pathname } = window.location;
        navigate(
          `/user/login?redirect=${encodeURIComponent(pathname + search)}`,
          { replace: true },
        );
      })();
      return;
    }
    if (key === 'theme') {
      setSettingDrawerOpen(true);
    }
  };

  if (!currentUser) {
    return <Spin size="small" />;
  }

  return (
    <HeaderDropdown
      placement="bottomRight"
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
      arrow
    >
      {children}
    </HeaderDropdown>
  );
};
