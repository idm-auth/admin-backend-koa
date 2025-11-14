import Router from '@koa/router';
import { getLogger } from '@/plugins/pino.plugin';

export const logRoutesDetailed = async (
  router: Router,
  prefix = '',
  level = 0
) => {
  const logger = await getLogger();
  const indent = '  '.repeat(level);
  const routes = router.stack;

  if (level === 0) {
    logger.info('Mapa completo de rotas');
    logger.info('═'.repeat(60));
  }

  routes.forEach((layer) => {
    const methods = layer.methods.filter((method) => method !== 'HEAD');
    const path = prefix + layer.path;

    methods.forEach((method) => {
      logger.info({ method, path, level, indent }, 'Rota detalhada registrada');
    });
  });

  if (level === 0) {
    logger.info('═'.repeat(60));
    logger.info({ totalRoutes: routes.length }, 'Total de rotas registradas');
  }
};
