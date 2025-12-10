import Router from '@koa/router';
import { getLogger } from '@/plugins/pino.plugin';

export const logRoutes = async (router: Router, prefix = '') => {
  const logger = await getLogger();
  const routes = router.stack;

  logger.info('Rotas registradas');
  logger.info('─'.repeat(50));

  routes.forEach((layer) => {
    const methods = layer.methods
      .filter((method) => method !== 'HEAD')
      .join(', ');
    const path = prefix + layer.path;
    logger.info({ methods, path }, 'Rota registrada');
  });

  logger.info('─'.repeat(50));
  logger.info({ totalRoutes: routes.length }, 'Total de rotas');
};
