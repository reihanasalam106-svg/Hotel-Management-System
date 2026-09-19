import app from './app.js';
import { config } from './config/index.js';

const server = app.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(` Hotel Management API Server Running`);
  console.log(` Port:        ${config.port}`);
  console.log(` Environment: ${config.nodeEnv}`);
  console.log(` Client URL:  ${config.clientUrl}`);
  console.log(` Base API:    http://localhost:${config.port}/api/v1`);
  console.log(` Health:      http://localhost:${config.port}/api/v1/health`);
  console.log(`=========================================`);
});

// Graceful shutdown handling
const shutdown = () => {
  console.log('\nGracefully shutting down Hotel Management API Server...');
  server.close(() => {
    console.log('Server closed successfully.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
