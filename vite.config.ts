import { defineConfig } from 'vite';
export default defineConfig({server:{host:'0.0.0.0'},test:{include:['tests/**/*.test.ts'],environment:'node'}} as any);
