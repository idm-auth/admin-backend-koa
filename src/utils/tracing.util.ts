import {
  trace,
  Span,
  SpanStatusCode,
  SpanKind,
  context,
} from '@opentelemetry/api';
import { SERVICE_NAME, SERVICE_VERSION } from '@/telemetry';

const tracer = trace.getTracer(SERVICE_NAME, SERVICE_VERSION);

export const withSpan = <T>(
  config: {
    name: string;
    attributes?: Record<string, string | number | boolean>;
  },
  fn: (span: Span) => T
): T => {
  const span = tracer.startSpan(config.name, { kind: SpanKind.INTERNAL });
  if (config.attributes) {
    span.setAttributes(config.attributes);
  }

  return context.with(trace.setSpan(context.active(), span), () => {
    try {
      const result = fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: (error as Error).message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
};

export const withSpanAsync = async <T>(
  config: {
    name: string;
    attributes?: Record<string, string | number | boolean>;
  },
  fn: (span: Span) => Promise<T>
): Promise<T> => {
  const span = tracer.startSpan(config.name, { kind: SpanKind.INTERNAL });
  if (config.attributes) {
    span.setAttributes(config.attributes);
  }

  return context.with(trace.setSpan(context.active(), span), async () => {
    try {
      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: (error as Error).message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
};
