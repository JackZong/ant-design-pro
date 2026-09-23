import { request } from '@/utils/request';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: Record<string, unknown>) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: Record<string, unknown>) {
  return request<Record<string, unknown>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(
  body: API.LoginParams,
  options?: Record<string, unknown>,
) {
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 发送验证码 GET /api/login/captcha */
export async function getFakeCaptcha(
  params: { phone?: string },
  options?: Record<string, unknown>,
) {
  return request<API.FakeCaptcha>('/api/login/captcha', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
