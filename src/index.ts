import { createTelemetrySDK } from 'koa-inversify-framework/telemetry';
import { trace } from '@opentelemetry/api';

const sdk = createTelemetrySDK();
sdk.start();

void (async () => {
  const { bootstrap, listen, shutdown } =
    await import('@/infrastructure/core/bootstrap');

  await bootstrap(sdk);

  const tracer = trace.getTracer('bootstrap startup');
  const span = tracer.startSpan('bootstrap-startup');
  span.setAttribute('bootstrap.start_time', new Date().toISOString());
  span.setAttribute('node.version', process.version);
  span.setAttribute('node.env', process.env.NODE_ENV || 'development');
  span.end();

  await listen();

  const shutdownHandler = async () => {
    await shutdown();
    await sdk.shutdown();
    process.exit(0);
  };

  process.on('SIGTERM', () => void shutdownHandler());
  process.on('SIGINT', () => void shutdownHandler());
})();
