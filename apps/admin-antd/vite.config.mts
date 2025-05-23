import { defineConfig } from '@vben/vite-config';
import path from 'path';


export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:8000/',
            ws: true,
          },
        },
      },
    },
  };
});
