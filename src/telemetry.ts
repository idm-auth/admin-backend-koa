import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

export const SERVICE_NAME = 'backend-koa-iam';
export const SERVICE_VERSION = '1.0.0';

const traceExporter = new OTLPTraceExporter({
  url:
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
    'http://jaeger:4318/v1/traces',
});

const prometheusExporter = new PrometheusExporter({
  port: parseInt(process.env.PROMETHEUS_PORT || '9090'),
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
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
      'http://jaeger:4318/v1/traces'
  );
  console.log(
    'Prometheus metrics:',
    `http://localhost:${process.env.PROMETHEUS_PORT || '9090'}/metrics`
  );
};

export const shutdownTelemetry = async () => {
  await sdk.shutdown();
  console.log('OpenTelemetry terminated');
};
