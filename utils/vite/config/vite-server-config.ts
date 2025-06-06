import { ServerOptions } from 'vite';

export default {
  server: {
    port: 4000,
    host: '0.0.0.0',
    hmr: true,
  },
} satisfies { server: ServerOptions };
