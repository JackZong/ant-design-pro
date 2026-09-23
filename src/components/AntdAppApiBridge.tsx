import { App as AntdApp } from 'antd';
import React, { useEffect } from 'react';
import { setAntdAppApis } from '@/utils/antdApp';

/** Registers App.useApp() message/notification for non-React modules (request). */
export function AntdAppApiBridge({ children }: { children: React.ReactNode }) {
  const { message, notification } = AntdApp.useApp();

  useEffect(() => {
    setAntdAppApis({ message, notification });
  }, [message, notification]);

  return children;
}
