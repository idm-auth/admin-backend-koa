import { inject } from 'inversify';
import { Configuration } from '@/infrastructure/core/stereotype.decorator';
import { Logger } from 'pino';
import {
  KoaServer,
  KoaServerSymbol,
} from '@/infrastructure/koa/koaServer.provider';
import {
  MongoDB,
  MongoDBSymbol,
} from '@/infrastructure/mongodb/mongodb.provider';
import {
  LoggerSymbol,
  flushLogger,
} from '@/infrastructure/logger/logger.provider';
import {
  Telemetry,
  TelemetrySymbol,
} from '@/infrastructure/telemetry/telemetry.provider';
import {
  Swagger,
  SwaggerSymbol,
} from '@/infrastructure/swagger/swagger.provider';

export interface ILifecycle {
  init(): Promise<void>;
  shutdown(): Promise<void>;
}

export const AppSymbol = Symbol.for('App');

@Configuration(AppSymbol)
export class App implements ILifecycle {
  constructor(
    @inject(LoggerSymbol) private logger: Logger,
    @inject(MongoDBSymbol) private mongodb: MongoDB,
    @inject(TelemetrySymbol) private telemetry: Telemetry,
    @inject(SwaggerSymbol) private swagger: Swagger,
    @inject(KoaServerSymbol) private koaServer: KoaServer
  ) {}

  async init(): Promise<void> {
    await this.telemetry.init();
    await this.mongodb.init();
    await this.koaServer.init();
  }

  async listen(): Promise<void> {
    await this.koaServer.listen();
  }

  async shutdown(): Promise<void> {
    await this.koaServer.shutdown();
    await this.mongodb.shutdown();
    await this.telemetry.shutdown();
    flushLogger(this.logger);
  }
}
