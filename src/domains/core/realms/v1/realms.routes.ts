import * as realms from '@/domains/core/realms/latest/realms.routes';
import { MagicRouter } from '@/utils/core/MagicRouter';

export const initialize = async () => {
  try {
    const router = new MagicRouter({
      prefix: '/v1',
    });
    const realmsRouter = await realms.initialize();
    router.useMagic(realmsRouter);

    return router;
  } catch (error) {
    throw new Error(
      `Failed to initialize v1 realms routes: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};
