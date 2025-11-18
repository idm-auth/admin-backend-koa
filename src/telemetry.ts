import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { getEnvValue, EnvKey } from './plugins/dotenv.plugin';

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

export const initTelemetry = () => {
  sdk.start();
  console.log('OpenTelemetry started successfully');
  console.log(
    'OTLP traces endpoint:',
    getEnvValue(EnvKey.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT)
  );
  console.log(
    'Prometheus metrics:',
    `http://localhost:${getEnvValue(EnvKey.PROMETHEUS_PORT)}/metrics`
  );
};

export const shutdownTelemetry = async () => {
  await sdk.shutdown();
  console.log('OpenTelemetry terminated');
};
