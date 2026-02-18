import * as esbuild from 'esbuild';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/index.js',
  format: 'esm',
  external: [
    'mongoose',
    'pino',
    'pino-pretty',
    'pino-caller',
    '@opentelemetry/*',
    'koa',
    '@koa/*',
    'koa-*',
    'dotenv',
    'inversify',
    'reflect-metadata',
    'swagger-ui-dist',
    'axios',
    'bcrypt',
    'jsonwebtoken',
    '@idm-auth/*',
  ],
  define: {
    '__PKG_NAME__': JSON.stringify(pkg.name),
    '__PKG_VERSION__': JSON.stringify(pkg.version),
  },
});

console.log('Build completed!');
