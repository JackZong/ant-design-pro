import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { createMockMiddleware } from './mock/vite-mock';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(
  readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'),
);
const vitePkg = JSON.parse(
  readFileSync(
    path.resolve(__dirname, 'node_modules/vite/package.json'),
    'utf-8',
  ),
);

function getCommitHash(): string {
  if (process.env.COMMIT_HASH) return process.env.COMMIT_HASH;
  if (process.env.CF_PAGES_COMMIT_SHA) return process.env.CF_PAGES_COMMIT_SHA;
  try {
    return execSync('git rev-parse HEAD', {
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf-8',
    }).trim();
  } catch {
    return '';
  }
}

function apiMockPlugin(): Plugin {
  return {
    name: 'api-mock',
    configureServer(server) {
      server.middlewares.use(createMockMiddleware());
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiMockPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@root': path.resolve(__dirname),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __VITE_VERSION__: JSON.stringify(vitePkg.version),
    'process.env.COMMIT_HASH': JSON.stringify(getCommitHash()),
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV ?? 'development',
    ),
  },
  server: {
    port: 8000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
