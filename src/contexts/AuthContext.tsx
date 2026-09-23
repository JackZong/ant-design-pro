import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import React, {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultSettings from '../../config/defaultSettings';
import { currentUser as queryCurrentUser } from '@/services/api';

const LOGIN_PATH = '/user/login';
const PUBLIC_PATHS = [LOGIN_PATH];

export type AuthState = {
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading: boolean;
  settingDrawerOpen?: boolean;
  fetchUserInfo: () => Promise<API.CurrentUser | undefined>;
  setCurrentUser: (user: API.CurrentUser | undefined) => void;
  setSettings: (settings: Partial<LayoutSettings>) => void;
  setSettingDrawerOpen: (open: boolean) => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<API.CurrentUser>();
  const [settings, setSettings] = useState<Partial<LayoutSettings>>(
    defaultSettings as Partial<LayoutSettings>,
  );
  const [settingDrawerOpen, setSettingDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserInfo = useCallback(async () => {
    try {
      const msg = await queryCurrentUser({ skipErrorHandler: true });
      return msg.data;
    } catch {
      const { pathname, search, hash } = window.location;
      if (!PUBLIC_PATHS.includes(pathname)) {
        navigate(
          `${LOGIN_PATH}?redirect=${encodeURIComponent(pathname + search + hash)}`,
          { replace: true },
        );
      }
      return undefined;
    }
  }, [navigate]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (PUBLIC_PATHS.includes(location.pathname)) {
        if (!cancelled) setLoading(false);
        return;
      }
      const user = await fetchUserInfo();
      if (!cancelled) {
        startTransition(() => {
          setCurrentUser(user);
          setLoading(false);
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchUserInfo, location.pathname]);

  const value = useMemo<AuthState>(
    () => ({
      currentUser,
      settings,
      loading,
      settingDrawerOpen,
      fetchUserInfo,
      setCurrentUser,
      setSettings,
      setSettingDrawerOpen,
    }),
    [
      currentUser,
      settings,
      loading,
      settingDrawerOpen,
      fetchUserInfo,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
