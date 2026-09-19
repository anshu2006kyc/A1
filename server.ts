import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import app, { pendingPayinOrders } from './api/app.ts';

dotenv.config();

const PORT = 3000;
const HOST = '0.0.0.0';

async function startServer() {
  // --- VITE DEV MIDDLEWARE / STATIC ASSETS ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`AKM Investment Server running on http://${HOST}:${PORT}`);
  });
}

// Automatically start standalone server unless running in Vercel Serverless environment
if (process.env.VERCEL !== '1') {
  startServer();
}

export { app, pendingPayinOrders };
export default app;
