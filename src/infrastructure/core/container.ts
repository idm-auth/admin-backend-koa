import { Container } from "inversify";
import { App, AppSymbol } from "@/infrastructure/core/app";
import {
  KoaServer,
  KoaServerSymbol,
} from "@/infrastructure/koa/koaServer.provider";
import {
  MongoDB,
  MongoDBSymbol,
} from "@/infrastructure/mongodb/mongodb.provider";
import {
  createLogger,
  LoggerSymbol,
} from "@/infrastructure/logger/logger.provider";
import { Env, EnvSymbol } from "@/infrastructure/env/env.provider";
import {
  Swagger,
  SwaggerSymbol,
} from "@/infrastructure/swagger/swagger.provider";
import {
  Telemetry,
  TelemetrySymbol,
} from "@/infrastructure/telemetry/telemetry.provider";

const container = new Container();

export const initializeContainer = async (): Promise<void> => {
  container.bind(EnvSymbol).to(Env).inSingletonScope();
  const logger = await createLogger();
  container.bind(LoggerSymbol).toConstantValue(logger);
  container.bind(MongoDBSymbol).to(MongoDB).inSingletonScope();
  container.bind(TelemetrySymbol).to(Telemetry).inSingletonScope();
  container.bind(SwaggerSymbol).to(Swagger).inSingletonScope();
  container.bind(KoaServerSymbol).to(KoaServer).inSingletonScope();
  container.bind(AppSymbol).to(App).inSingletonScope();

  const env = container.get<Env>(EnvSymbol);
  const mongodb = container.get<MongoDB>(MongoDBSymbol);
  env.setMongoDB(mongodb);
};

export const reconfigureLogger = async (): Promise<void> => {
  const newLogger = await createLogger(container);
  const binded = await container.rebind(LoggerSymbol);
  binded.toConstantValue(newLogger);
};

export { container };
