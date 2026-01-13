import { createTelemetrySDK } from 'koa-inversify-framework/telemetry';

export const telemetrySdk = createTelemetrySDK();

export async function shutdownTelemetry(): Promise<void> {
  await telemetrySdk.shutdown();
}
