import { MongoMemoryServer } from 'mongodb-memory-server';
import Koa from 'koa';

declare global {
  var testMongo: MongoMemoryServer;
  var testKoaApp: Koa;
  var __vitest_worker__: { filepath?: string };
}
