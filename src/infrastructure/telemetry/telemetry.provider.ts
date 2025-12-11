import { inject } from 'inversify';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { Logger } from 'pino';
import { ILifecycle } from '@/infrastructure/core/app';
import { Env, EnvSymbol, EnvKey } from '@/infrastructure/env/env.provider';
import { LoggerSymbol } from '@/infrastructure/logger/logger.provider';
import { Configuration } from '@/infrastructure/core/stereotype.decorator';

export const TelemetrySymbol = Symbol.for('Telemetry');

@Configuration(TelemetrySymbol)
export class Telemetry implements ILifecycle {
  private sdk: NodeSDK;

  constructor(
    @inject(EnvSymbol) private env: Env,
    @inject(LoggerSymbol) private logger: Logger
  ) {
    const traceExporter = new OTLPTraceExporter({
      url: this.env.get(EnvKey.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT),
    });

    const prometheusExporter = new PrometheusExporter({
      port: parseInt(this.env.get(EnvKey.PROMETHEUS_PORT)),
      endpoint: '/metrics',
    });

    this.sdk = new NodeSDK({
      serviceName: this.env.get(EnvKey.SERVICE_NAME),
      instrumentations: [getNodeAutoInstrumentations()],
      traceExporter,
      metricReader: prometheusExporter,
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async init(): Promise<void> {
    this.sdk.start();
    this.logger.info('OpenTelemetry started successfully');
    this.logger.info(
      {
        otlpEndpoint: this.env.get(EnvKey.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT),
        prometheusEndpoint: `http://localhost:${this.env.get(EnvKey.PROMETHEUS_PORT)}/metrics`,
      },
      'Telemetry endpoints configured'
    );
  }

  async shutdown(): Promise<void> {
    await this.sdk.shutdown();
    this.logger.info('OpenTelemetry terminated');
  }
}
