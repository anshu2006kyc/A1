import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import app, { pendingPayinOrders } from './api/index.ts';

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
    // Static assets with long-term immutable caching for CDN & edge proxies
    app.use(
      '/assets',
      express.static(path.join(distPath, 'assets'), {
        maxAge: '1y',
        immutable: true,
        etag: true
      })
    );
    // General static files with standard cache-control
    app.use(
      express.static(distPath, {
        maxAge: '1h',
        etag: true
      })
    );
    app.get('*', (_req, res) => {
      // HTML entry point: avoid aggressive caching so users get the latest version
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`AKM ENTERPRISES Server running on http://${HOST}:${PORT}`);
  });

  // Enterprise keep-alive tuning for high-traffic load balancers (Cloud Run, AWS ALB, Nginx)
  // Ensures server does not close sockets before the load balancer does
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;

  // Graceful shutdown handling for zero-downtime rolling deployments
  const gracefulShutdown = (signal: string) => {
    console.log(`Received ${signal}. Closing server gracefully for zero-downtime deployment...`);
    server.close(() => {
      console.log('HTTP server closed cleanly. Exiting process.');
      process.exit(0);
    });
    // Force shutdown after 10s if connections refuse to close
    setTimeout(() => {
      console.error('Forcefully terminating server after timeout.');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

// Automatically start standalone server unless running in Vercel Serverless environment
if (process.env.VERCEL !== '1') {
  startServer();
}

export { app, pendingPayinOrders };
export default app;
