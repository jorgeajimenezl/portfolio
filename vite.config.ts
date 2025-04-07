import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/portfolio/',
  plugins: [svelte()],
  server: {
    port: 3000,
  },
});
