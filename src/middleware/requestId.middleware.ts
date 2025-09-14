// requestIdMiddleware.ts
import { pinoLogger } from '@/plugins/pino.plugin';
import { runWithContext } from '@/utils/localStorage.util';
import { Context } from 'koa';
import type { Logger } from 'pino';
import { v4 as uuidv4 } from 'uuid';

export const requestIdMiddleware = async (
  ctx: Context,
  next: () => Promise<unknown>
) => {
  const requestId = ctx.get('X-Request-ID') || uuidv4(); // pega do header ou gera novo

  // cria um child logger com o requestId
  let logger: Logger | null = pinoLogger.logger;
  if (!logger) {
    logger = await pinoLogger.initialize();
  }

  const requestLogger = logger.child({ requestId });

  // cria o contexto único
  const context = { requestId, logger: requestLogger };

  return runWithContext(context, async () => {
    ctx.set('X-Request-ID', requestId);
    await next();
  });
};
