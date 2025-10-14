import Router from '@koa/router';

export const logRoutes = (router: Router, prefix = '') => {
  const routes = router.stack;

  console.log('\n📍 Rotas registradas:');
  console.log('─'.repeat(50));

  routes.forEach((layer) => {
    const methods = layer.methods
      .filter((method) => method !== 'HEAD')
      .join(', ');
    const path = prefix + layer.path;
    console.log(`${methods.padEnd(15)} ${path}`);
  });

  console.log('─'.repeat(50));
  console.log(`Total: ${routes.length} rotas\n`);
};
