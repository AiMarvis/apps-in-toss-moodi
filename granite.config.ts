import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'moodi',
  brand: {
    displayName: '무디',
    primaryColor: '#3183F6',
    icon: '/moodi-icon.svg',
  },
  web: {
    host: 'localhost',  // 에뮬레이터에서는 localhost 사용 (adb reverse로 연결)
    port: 5173,
    commands: {
      dev: 'vite --host --port 5173 --strictPort',
      build: 'tsc -b && vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});
