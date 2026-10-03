import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/graphql': {
        target: process.env.VITE_BACKEND_URL ?? 'http://localhost:3000',
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        math: 'always', // 启用数学计算
        relativeUrls: true, // 启用相对路径
        javascriptEnabled: true,
        modifyVars: {
          // 在这里可以自定义全局 Less 变量（可选）
          // '@primary-color': '#007bff',
        },
      },
    },
  },
});
