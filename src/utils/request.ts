import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { getMessage, getNotification } from '@/utils/antdApp';

enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

interface ResponseStructure {
  success?: boolean;
  data?: unknown;
  errorCode?: number | string;
  errorMessage?: string;
  showType?: ErrorShowType;
}

export type RequestOptions = AxiosRequestConfig & {
  skipErrorHandler?: boolean;
  getResponse?: boolean;
};

const instance = axios.create({
  timeout: 10000,
  baseURL: import.meta.env.DEV
    ? ''
    : 'https://pro-api.ant-design-demo.workers.dev',
});

function handleBizError(res: ResponseStructure) {
  if (res.success === false) {
    const error = new Error(res.errorMessage || 'Request failed') as Error & {
      name: string;
      info: ResponseStructure;
    };
    error.name = 'BizError';
    error.info = res;
    throw error;
  }
}

function handleError(error: AxiosError | Error, opts?: RequestOptions) {
  if (opts?.skipErrorHandler) throw error;

  const anyError = error as Error & {
    name: string;
    info?: ResponseStructure;
    response?: AxiosResponse;
    request?: unknown;
  };

  try {
    const message = getMessage();
    const notification = getNotification();

    if (anyError.name === 'BizError' && anyError.info) {
      const { errorMessage, errorCode, showType } = anyError.info;
      switch (showType) {
        case ErrorShowType.SILENT:
          break;
        case ErrorShowType.WARN_MESSAGE:
          message.warning(errorMessage);
          break;
        case ErrorShowType.ERROR_MESSAGE:
          message.error(errorMessage);
          break;
        case ErrorShowType.NOTIFICATION:
          notification.open({
            title: String(errorCode ?? ''),
            description: errorMessage,
          });
          break;
        case ErrorShowType.REDIRECT:
          window.location.href = '/user/login';
          break;
        default:
          message.error(errorMessage);
      }
      return;
    }

    if (anyError.response) {
      message.error(`Response status:${anyError.response.status}`);
    } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
      message.error(
        'Network unavailable. Please check your connection and try again.',
      );
    } else if (anyError.request) {
      message.error('None response! Please retry.');
    } else {
      message.error('Request error, please retry.');
    }
  } catch {
    // App APIs not ready yet; rethrow original error
  }
  throw error;
}

export async function request<T = unknown>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { skipErrorHandler, getResponse, ...axiosConfig } = options;

  try {
    const response = await instance.request<T>({
      url,
      ...axiosConfig,
    });

    const data = response.data as ResponseStructure;
    if (
      data &&
      typeof data === 'object' &&
      'success' in data &&
      data.success === false
    ) {
      handleBizError(data);
    }

    if (getResponse) {
      return response as unknown as T;
    }
    return response.data;
  } catch (error) {
    handleError(error as AxiosError, { skipErrorHandler });
    throw error;
  }
}

export default request;
