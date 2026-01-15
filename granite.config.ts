import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'moodi',
  brand: {
    displayName: '무디',
    primaryColor: '#3183F6',
    icon: '/moodi-icon.svg',
  },
  web: {
    host: '0.0.0.0',  // 모든 네트워크 인터페이스에서 접근 가능
    port: 5173,
    commands: {
      dev: 'vite --host --port 5173 --strictPort',
      build: 'tsc -b && vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});
