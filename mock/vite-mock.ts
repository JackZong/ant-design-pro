import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Connect } from 'vite';

const defaultUser = {
  name: 'Serati Ma',
  avatar:
    'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  userid: '00000001',
  email: 'antdesign@alipay.com',
  signature: '海纳百川，有容乃大',
  title: '交互专家',
  group: '蚂蚁集团－某某某事业群－某某平台部－某某技术部－UED',
  tags: [
    { key: '0', label: '很有想法的' },
    { key: '1', label: '专注设计' },
  ],
  notifyCount: 12,
  unreadCount: 11,
  country: 'China',
  access: '',
  geographic: {
    province: { label: '浙江省', key: '330000' },
    city: { label: '杭州市', key: '330100' },
  },
  address: '西湖区工专路 77 号',
  phone: '0752-268888888',
};

let access = '';

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function sendJson(
  res: ServerResponse,
  status: number,
  data: unknown,
): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

async function wait(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

export function createMockMiddleware(): Connect.NextHandleFunction {
  return async (req, res, next) => {
    const url = req.url?.split('?')[0] ?? '';
    if (!url.startsWith('/api/')) {
      next();
      return;
    }

    const method = (req.method ?? 'GET').toUpperCase();

    if (method === 'GET' && url === '/api/currentUser') {
      if (!access) {
        sendJson(res, 401, {
          data: { isLogin: false },
          errorCode: '401',
          errorMessage: '请先登录！',
          success: true,
        });
        return;
      }
      sendJson(res, 200, {
        success: true,
        data: { ...defaultUser, access },
      });
      return;
    }

    if (method === 'POST' && url === '/api/login/account') {
      const raw = await readBody(req);
      const body = raw ? JSON.parse(raw) : {};
      const { password, username, type } = body;
      await wait(500);

      if (password === 'ant.design' && username === 'admin') {
        access = 'admin';
        sendJson(res, 200, {
          status: 'ok',
          type,
          currentAuthority: 'admin',
        });
        return;
      }
      if (password === 'ant.design' && username === 'user') {
        access = 'user';
        sendJson(res, 200, {
          status: 'ok',
          type,
          currentAuthority: 'user',
        });
        return;
      }
      if (type === 'mobile') {
        access = 'admin';
        sendJson(res, 200, {
          status: 'ok',
          type,
          currentAuthority: 'admin',
        });
        return;
      }

      access = 'guest';
      sendJson(res, 200, {
        status: 'error',
        type,
        currentAuthority: 'guest',
      });
      return;
    }

    if (method === 'POST' && url === '/api/login/outLogin') {
      access = '';
      sendJson(res, 200, { data: {}, success: true });
      return;
    }

    if (method === 'GET' && url === '/api/login/captcha') {
      await wait(300);
      sendJson(res, 200, 'captcha-xxx');
      return;
    }

    next();
  };
}
