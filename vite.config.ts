import { defineConfig } from 'vite';
export default defineConfig({
 server:{host:'0.0.0.0'},
 // Development uses a same-origin module worker. The release builder embeds the
 // bundled worker bytes for portable HTML and ships a self resource for MV3.
 define:{__LATIMUS_CSV_WORKER__:'undefined'},
 worker:{format:'iife'},
 test:{include:['tests/**/*.test.ts'],environment:'node'}
} as any);
