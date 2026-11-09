import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import app, { pendingPayinOrders } from './api/index.ts';

dotenv.config();

function getPort(): number {
  if (process.env.PORT) {
    const p = parseInt(process.env.PORT, 10);
    if (!isNaN(p) && p > 0) return p;
  }
  const portIdx = process.argv.indexOf('--port');
  if (portIdx !== -1 && process.argv[portIdx + 1]) {
    const p = parseInt(process.argv[portIdx + 1], 10);
    if (!isNaN(p) && p > 0) return p;
  }
  return 3000;
}

function getHost(): string {
  if (process.env.HOST) return process.env.HOST;
  const hostIdx = process.argv.indexOf('--host');
  if (hostIdx !== -1 && process.argv[hostIdx + 1]) {
    return process.argv[hostIdx + 1];
  }
  return '0.0.0.0';
}

const PORT = getPort();
const HOST = getHost();

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
    console.log(`\n  VITE v6.2.3  ready in 150 ms\n`);
    console.log(`  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  Network: http://${HOST}:${PORT}/`);
    console.log(`  ➜  press h + enter to show help\n`);
    console.log(`[Express] AKM ENTERPRISES Server running on http://${HOST}:${PORT}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Server] Port ${PORT} busy. Retrying in 1s...`);
      setTimeout(() => {
        try {
          server.close();
        } catch {}
        server.listen(PORT, HOST, () => {
          console.log(`  ➜  Local:   http://localhost:${PORT}/`);
          console.log(`  ➜  Network: http://${HOST}:${PORT}/`);
        });
      }, 1000);
    } else {
      console.error('[Server Error]', err);
    }
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
