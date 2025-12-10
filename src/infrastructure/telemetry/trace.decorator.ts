import { trace, SpanStatusCode, SpanKind, context } from '@opentelemetry/api';
import type { Span } from '@opentelemetry/api';

export type { Span };

declare const __PKG_NAME__: string;
declare const __PKG_VERSION__: string;

const PKG_NAME =
  typeof __PKG_NAME__ !== 'undefined' ? __PKG_NAME__ : 'backend-koa';
const PKG_VERSION =
  typeof __PKG_VERSION__ !== 'undefined' ? __PKG_VERSION__ : '1.0.0';

function createSpan(
  name: string,
  attributes?: Record<string, string | number | boolean>
): Span {
  const tracer = trace.getTracer(PKG_NAME, PKG_VERSION);
  const span = tracer.startSpan(name, { kind: SpanKind.INTERNAL });
  if (attributes) span.setAttributes(attributes);
  return span;
}

function handleSuccess(span: Span): void {
  span.setStatus({ code: SpanStatusCode.OK });
}

function handleError(span: Span, error: Error): void {
  span.recordException(error);
  span.setStatus({
    code: SpanStatusCode.ERROR,
    message: error.message,
  });
}

export function Trace(
  spanName?: string,
  attributes?: Record<string, string | number | boolean>
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const name = spanName || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = function (...args: any[]) {
      const span = createSpan(name, attributes);

      return context.with(trace.setSpan(context.active(), span), () => {
        try {
          const result = originalMethod.apply(this, args);
          handleSuccess(span);
          span.end();
          return result;
        } catch (error) {
          handleError(span, error as Error);
          span.end();
          throw error;
        }
      });
    };

    return descriptor;
  };
}

export function TraceAsync(
  spanName?: string,
  attributes?: Record<string, string | number | boolean>
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const name = spanName || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const span = createSpan(name, attributes);

      return context.with(trace.setSpan(context.active(), span), async () => {
        try {
          const result = await originalMethod.apply(this, args);
          handleSuccess(span);
          return result;
        } catch (error) {
          handleError(span, error as Error);
          throw error;
        } finally {
          span.end();
        }
      });
    };

    return descriptor;
  };
}

export function getCurrentSpan(): Span | undefined {
  return trace.getSpan(context.active());
}
