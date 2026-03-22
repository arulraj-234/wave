import { serve } from '@hono/node-server';
import app from './dist/server.js';

const PORT = process.env.PORT || 3001;

serve({ fetch: app.fetch, port: Number(PORT) }, (info) => {
  console.log(`JioSaavn API running on http://localhost:${info.port}`);
});
