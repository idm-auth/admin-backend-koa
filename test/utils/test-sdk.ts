import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { InMemoryMetricExporter, AggregationTemporality, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { InMemorySpanExporter } from '@opentelemetry/sdk-trace-node';

export function createTestNodeSDK(): NodeSDK {
  const spanExporter = new InMemorySpanExporter();
  const metricExporter = new InMemoryMetricExporter(AggregationTemporality.CUMULATIVE);
  const metricReader = new PeriodicExportingMetricReader({ exporter: metricExporter });

  const sdk = new NodeSDK({
    serviceName: 'test-service',
    instrumentations: [getNodeAutoInstrumentations()],
    traceExporter: spanExporter,
    metricReaders: [metricReader],
  });

  return sdk;
}
