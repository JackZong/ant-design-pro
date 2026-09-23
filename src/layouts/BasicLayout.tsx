import {
  CrownOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { ProLayoutProps } from '@ant-design/pro-components';
import { ProLayout, SettingDrawer } from '@ant-design/pro-components';
import { createStyles } from 'antd-style';
import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import access from '@/access';
import {
  AvatarDropdown,
  ErrorBoundary,
  Footer,
  LangSwitch,
} from '@/components';
import { useAuth } from '@/contexts/AuthContext';

const loginPath = '/user/login';

const useCollapseStyles = createStyles(
  ({ token, css }, { dark }: { dark: boolean }) => ({
    trigger: css`
      display: flex;
      align-items: center;
      gap: 8px;
      box-sizing: border-box;
      width: calc(100% + 16px);
      height: 48px;
      margin-top: auto;
      margin-inline: -8px;
      padding-inline: 20px;
      border: 0;
      border-top: 1px solid ${dark ? 'rgba(255, 255, 255, 0.12)' : token.colorSplit};
      background: transparent;
      color: ${dark ? 'rgba(255, 255, 255, 0.65)' : token.colorTextSecondary};
      font-size: ${token.fontSize}px;
      font-family: inherit;
      line-height: ${token.lineHeight};
      text-align: start;
      cursor: pointer;
      flex-shrink: 0;

      .anticon {
        font-size: 16px;
      }

      &:hover {
        color: ${dark ? '#fff' : token.colorText};
        background: ${dark ? 'rgba(255, 255, 255, 0.08)' : token.colorBgTextHover};
      }

      &:focus-visible {
        outline: 2px solid ${token.colorPrimary};
        outline-offset: -2px;
      }
    `,
    triggerCollapsed: css`
      justify-content: center;
      padding-inline: 0;
    `,
    label: css`
      overflow: hidden;
      white-space: nowrap;
    `,
  }),
);

const SiderCollapseButton: React.FC<{
  collapsed: boolean;
  dark: boolean;
  onClick: () => void;
}> = ({ collapsed, dark, onClick }) => {
  const intl = useIntl();
  const { styles, cx } = useCollapseStyles({ dark });
  const label = intl.formatMessage({
    id: collapsed ? 'menu.expand' : 'menu.collapse',
    defaultMessage: collapsed ? '展开导航' : '收起导航',
  });

  return (
    <button
      type="button"
      className={cx(styles.trigger, collapsed && styles.triggerCollapsed)}
      aria-label={label}
      title={collapsed ? label : undefined}
      onClick={onClick}
    >
      {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      {collapsed ? null : <span className={styles.label}>{label}</span>}
    </button>
  );
};

const BasicLayout: React.FC = () => {
  const {
    currentUser,
    settings,
    settingDrawerOpen,
    loading,
    setSettings,
    setSettingDrawerOpen,
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const accessMap = access({ currentUser });
  const [collapsed, setCollapsed] = useState(false);
  const siderDark = settings?.navTheme === 'realDark';

  useEffect(() => {
    if (!loading && !currentUser && location.pathname !== loginPath) {
      navigate(
        `${loginPath}?redirect=${encodeURIComponent(
          location.pathname + location.search + location.hash,
        )}`,
        { replace: true },
      );
    }
  }, [loading, currentUser, location, navigate]);

  const route = useMemo<ProLayoutProps['route']>(
    () => ({
      path: '/',
      routes: [
        {
          path: '/welcome',
          name: intl.formatMessage({ id: 'menu.welcome' }),
          icon: <HomeOutlined />,
        },
        {
          path: '/admin',
          name: intl.formatMessage({ id: 'menu.admin' }),
          icon: <CrownOutlined />,
          access: 'canAdmin',
          routes: [
            {
              path: '/admin/sub-page',
              name: intl.formatMessage({ id: 'menu.admin.sub-page' }),
            },
          ],
        },
      ],
    }),
    [intl],
  );

  if (loading) {
    return null;
  }

  return (
    <ProLayout
      location={{ pathname: location.pathname }}
      route={route}
      menuItemRender={(item, dom) => {
        if (item.path) {
          return <Link to={item.path}>{dom}</Link>;
        }
        return dom;
      }}
      menuDataRender={(menuData) =>
        menuData.filter((item) => {
          if (
            item.access &&
            !accessMap[item.access as keyof typeof accessMap]
          ) {
            return false;
          }
          return true;
        })
      }
      actionsRender={() => [<LangSwitch key="lang" />]}
      avatarProps={{
        src: currentUser?.avatar,
        title: currentUser?.name || 'ProUser',
        render: (_, avatarChildren) => (
          <AvatarDropdown>{avatarChildren}</AvatarDropdown>
        ),
      }}
      footerRender={() => <Footer />}
      onMenuHeaderClick={() => navigate('/welcome')}
      ErrorBoundary={ErrorBoundary}
      {...settings}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      collapsedButtonRender={() => (
        <SiderCollapseButton
          collapsed={collapsed}
          dark={siderDark}
          onClick={() => setCollapsed((prev) => !prev)}
        />
      )}
    >
      <Outlet />
      <SettingDrawer
        disableUrlParams
        enableDarkTheme
        collapse={settingDrawerOpen}
        onCollapseChange={(open) => setSettingDrawerOpen(open)}
        settings={settings}
        onSettingChange={(next) => setSettings(next)}
      />
    </ProLayout>
  );
};

export default BasicLayout;
