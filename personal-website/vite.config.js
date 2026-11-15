import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env =loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: 'vercel-api-local-runner',
        configureServer(server) {
          server.middlewares.use('/api/spotify', async (req, res) => {
            try {
              const { default: handler } = await import('./api/spotify.js');
              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              };
              await handler(req, res);
            } catch (err) {
              console.error('Local Spotify API Error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ isPlaying: false, error: err.message }));
            }
          });
        },
      },
    ],
    server: {
      proxy: {
        '/api/visits': {
          target: 'https://api.counterapi.dev',
          changeOrigin: true,
          rewrite: (path) => {
            const isUp = path.includes('action=up');
            return `/v2/bababunny/bababunny-visits${isUp ? '/up' : ''}`;
          },
          headers: {
            Authorization: `Bearer ${env.VITE_COUNTER_API_TOKEN}`,
          },
        },
      },
    },
  }
})

