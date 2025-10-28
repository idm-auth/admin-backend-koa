import Router from '@koa/router';

export const logRoutesDetailed = (router: Router, prefix = '', level = 0) => {
  const indent = '  '.repeat(level);
  const routes = router.stack;

  if (level === 0) {
    console.log('\nMapa completo de rotas:');
    console.log('═'.repeat(60));
  }

  routes.forEach((layer) => {
    const methods = layer.methods.filter((method) => method !== 'HEAD');
    const path = prefix + layer.path;

    methods.forEach((method) => {
      const methodColor = getMethodColor(method);
      console.log(`${indent}${methodColor}${method.padEnd(8)}\x1b[0m ${path}`);
    });
  });

  if (level === 0) {
    console.log('═'.repeat(60));
    console.log(`📊 Total: ${routes.length} rotas registradas\n`);
  }
};

const getMethodColor = (method: string): string => {
  const colors = {
    GET: '\x1b[32m', // Verde
    POST: '\x1b[33m', // Amarelo
    PUT: '\x1b[34m', // Azul
    DELETE: '\x1b[31m', // Vermelho
    PATCH: '\x1b[35m', // Magenta
  };
  return colors[method as keyof typeof colors] || '\x1b[37m'; // Branco padrão
};
