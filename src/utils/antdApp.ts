import type { MessageInstance } from 'antd/es/message/interface';
import type { NotificationInstance } from 'antd/es/notification/interface';

let messageApi: MessageInstance | null = null;
let notificationApi: NotificationInstance | null = null;

export function setAntdAppApis(apis: {
  message: MessageInstance;
  notification: NotificationInstance;
}) {
  messageApi = apis.message;
  notificationApi = apis.notification;
}

export function getMessage(): MessageInstance {
  if (!messageApi) {
    throw new Error('Antd App message API is not ready');
  }
  return messageApi;
}

export function getNotification(): NotificationInstance {
  if (!notificationApi) {
    throw new Error('Antd App notification API is not ready');
  }
  return notificationApi;
}
