import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { IntlProvider } from 'react-intl';
import enUS from './en-US';
import zhCN from './zh-CN';

export type LocaleType = 'zh-CN' | 'en-US';

const messages: Record<LocaleType, Record<string, string>> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

type LocaleContextValue = {
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function detectLocale(): LocaleType {
  const saved = localStorage.getItem('umi_locale') || localStorage.getItem('locale');
  if (saved === 'en-US' || saved === 'zh-CN') return saved;
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US';
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleType>(detectLocale);

  const setLocale = useCallback((next: LocaleType) => {
    localStorage.setItem('locale', next);
    setLocaleState(next);
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
