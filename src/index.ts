console.log('oi');
import { glob } from 'glob';
import { Framework } from 'koa-inversify-framework';
import 'reflect-metadata';
import { pathToFileURL } from 'url';
import { getContainer } from './infrastructure/container.instance';
const container = getContainer();
void (async () => {
  const framework = new Framework();

  await framework.init(container);

  const files = await glob('src/domain/**/*.controller.ts', { absolute: true });
  console.log('[Project] Found files:', files.length);

  const modules = await Promise.all(
    files.map((file) => {
      console.log('[Project] Importing:', file);
      return import(pathToFileURL(file).href);
    })
  );

  const allSymbols = modules.flatMap((m) =>
    Object.values(m).filter((v) => typeof v === 'symbol')
  );
  console.log('[Project] Found symbols:', allSymbols.length);

  framework.register(allSymbols);
  await framework.listen();
})();

const shutdown = async () => {
  await framework.shutdown();
  process.exit(0);
};

process.on('SIGTERM', () => void shutdown());
process.on('SIGINT', () => void shutdown());
