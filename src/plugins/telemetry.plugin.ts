import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { getEnvValue, EnvKey } from './dotenv.plugin';
import { getLogger } from './pino.plugin';

export const SERVICE_NAME = 'backend-koa-iam';
export const SERVICE_VERSION = '1.0.0';

const traceExporter = new OTLPTraceExporter({
  url: getEnvValue(EnvKey.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT),
});

const prometheusExporter = new PrometheusExporter({
  port: parseInt(getEnvValue(EnvKey.PROMETHEUS_PORT)),
  endpoint: '/metrics',
});

const sdk = new NodeSDK({
  serviceName: SERVICE_NAME,
  instrumentations: [getNodeAutoInstrumentations()],
  traceExporter: traceExporter,
  metricReader: prometheusExporter,
});

export const initTelemetry = async () => {
  const logger = await getLogger();

  sdk.start();

  logger.info('OpenTelemetry started successfully');
  logger.info(
    {
      otlpEndpoint: getEnvValue(EnvKey.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT),
      prometheusEndpoint: `http://localhost:${getEnvValue(EnvKey.PROMETHEUS_PORT)}/metrics`,
    },
    'Telemetry endpoints configured'
  );
};

export const shutdownTelemetry = async () => {
  const logger = await getLogger();

  await sdk.shutdown();

  logger.info('OpenTelemetry terminated');
};
