import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // vite无法识别@符合，要通过配置，然后让懒加载进行商品
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') }
    ]
  }
})