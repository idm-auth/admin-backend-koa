import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { Context, Next } from 'koa';

export type MagicRouteConfig = RouteConfig & {
  name: string;
  middlewares?: Array<(ctx: Context, next: Next) => Promise<void>>;
  handlers: Array<(ctx: Context, next: Next) => Promise<void>>;
};
