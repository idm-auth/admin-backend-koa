import * as accounts from '@/domains/realms/accounts/latest/accounts.routes';
import { MagicRouter } from '@/utils/core/MagicRouter';

export const initialize = async () => {
  try {
    const router = new MagicRouter({
      prefix: '/v1',
    });
    const accountsRouter = await accounts.initialize();
    router.useMagic(accountsRouter);

    return router;
  } catch (error) {
    throw new Error(
      `Failed to initialize v1 accounts routes: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};
