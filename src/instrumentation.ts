import { createTelemetrySDK } from '@idm-auth/koa-inversify-framework/telemetry';

const sdk = createTelemetrySDK();
sdk.start();

export { sdk };
