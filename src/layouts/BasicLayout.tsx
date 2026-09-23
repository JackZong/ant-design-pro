import {
  CrownOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import type { ProLayoutProps } from '@ant-design/pro-components';
import {
  ProLayout,
  SettingDrawer,
} from '@ant-design/pro-components';
import { useIntl } from 'react-intl';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useMemo } from 'react';
import access from '@/access';
import { AvatarDropdown, ErrorBoundary, Footer, LangSwitch } from '@/components';
import { useAuth } from '@/contexts/AuthContext';

const loginPath = '/user/login';

const BasicLayout: React.FC = () => {
  const { currentUser, settings, settingDrawerOpen, loading, setSettings, setSettingDrawerOpen } =
    useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const accessMap = access({ currentUser });

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
          if (item.access && !accessMap[item.access as keyof typeof accessMap]) {
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
