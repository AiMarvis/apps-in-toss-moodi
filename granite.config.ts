import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'my-moodi',
  brand: {
    displayName: '무디',
    primaryColor: '#3183F6',
    icon: 'https://firebasestorage.googleapis.com/v0/b/moodi-b8811.firebasestorage.app/o/moodi-logo-image.png?alt=media&token=4eb0fbfc-0c4c-49d1-9b4a-204c41927ec7',
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
