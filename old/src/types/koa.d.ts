import 'koa';

declare module 'koa' {
  interface DefaultState {
    tenantId?: string;
    user?: {
      accountId: string;
    };
  }
}
