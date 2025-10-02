import { Context, Next } from 'koa';

export const loggerMiddleware = async (ctx: Context, next: Next) => {
  const start = Date.now();
  console.log(`[SWAGGER-POC] ${ctx.method} ${ctx.path} - Start`);
  
  await next();
  
  const duration = Date.now() - start;
  console.log(`[SWAGGER-POC] ${ctx.method} ${ctx.path} - ${ctx.status} (${duration}ms)`);
};

export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = {
      error: 'Unauthorized',
      details: 'Missing or invalid authorization header'
    };
    return;
  }

  // Mock auth validation
  const token = authHeader.replace('Bearer ', '');
  if (token !== 'valid-token') {
    ctx.status = 401;
    ctx.body = {
      error: 'Unauthorized',
      details: 'Invalid token'
    };
    return;
  }

  await next();
};

export const rateLimitMiddleware = async (ctx: Context, next: Next) => {
  // Mock rate limiting
  const clientIp = ctx.ip;
  console.log(`[RATE-LIMIT] Request from ${clientIp}`);
  
  // Simulate rate limit check (always pass for demo)
  await next();
};