import { container } from '@/infrastructure/core/container.instance';
import {
  createLogger,
  LoggerSymbol,
} from '@/infrastructure/logger/logger.provider';
import { Env, EnvSymbol } from '@/infrastructure/env/env.provider';
import { MongoDB, MongoDBSymbol } from '@/infrastructure/mongodb/mongodb.provider';

export const initializeContainer = async (): Promise<void> => {
  const logger = await createLogger();
  container.bind(LoggerSymbol).toConstantValue(logger);

  const env = container.get<Env>(EnvSymbol);
  const mongodb = container.get<MongoDB>(MongoDBSymbol);
  env.setMongoDB(mongodb);
};

export const reconfigureLogger = async (): Promise<void> => {
  const newLogger = await createLogger(container);
  const binded = await container.rebind(LoggerSymbol);
  binded.toConstantValue(newLogger);
};
