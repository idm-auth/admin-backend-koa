import { Container } from "inversify";
import pino from "pino";
import pinoCaller from "pino-caller";
import {
  MongoDB,
  MongoDBSymbol,
} from "@/infrastructure/mongodb/mongodb.provider";
import { Env, EnvSymbol, EnvKey } from "@/infrastructure/env/env.provider";

export const LoggerSymbol = Symbol.for("Logger");

export interface LoggerConfig {
  level?: string;
  transport?: pino.TransportSingleOptions | pino.TransportMultiOptions;
}

export const createLogger = async (
  container?: Container,
): Promise<pino.Logger> => {
  let config: LoggerConfig | null = null;
  let env: Env | undefined;

  if (container) {
    try {
      env = container.get<Env>(EnvSymbol);
      const mongodb = container.get<MongoDB>(MongoDBSymbol);
      const dbConfig = await mongodb
        .getCoreDb()
        .collection("config")
        .findOne({ key: "logger" });
      if (dbConfig?.value) {
        config = dbConfig.value;
      }
    } catch {
      // MongoDB não disponível, usa config padrão
    }
  }

  const baseLogger = pino({
    level: config?.level || env?.get(EnvKey.LOGGER_LEVEL) || "info",
    transport: config?.transport || {
      target: "pino-pretty",
      options: {
        destination: 1,
        colorize: true,
        singleLine: true,
        messageFormat: "[{requestId}] -> {msg}",
        sync: true,
      },
    },
  });

  return pinoCaller(baseLogger, { relativeTo: process.cwd() });
};

export const flushLogger = (logger: pino.Logger): void => {
  logger.flush();
};
