// Precisa sempre ser o primeiro para carregar antes de tudo
import { shutdownTelemetry, telemetrySdk } from '@/telemetry';

import { bootstrap, listen, shutdown } from '@/infrastructure/core/bootstrap';

void (async () => {
  await bootstrap(telemetrySdk);
  await listen();
})();

const shutdownHandler = async () => {
  await shutdown();
  await shutdownTelemetry();
  process.exit(0);
};

process.on('SIGTERM', () => void shutdownHandler());
process.on('SIGINT', () => void shutdownHandler());
