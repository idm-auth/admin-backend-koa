import { Configuration } from '@/infrastructure/core/stereotype.decorator';
import { config } from 'dotenv';
import path from 'path';
import type { MongoDB } from '@/infrastructure/mongodb/mongodb.provider';

export const EnvSymbol = Symbol.for('Env');

export enum EnvKey {
  PORT = 'PORT',
  NODE_ENV = 'NODE_ENV',
  MONGODB_URI = 'MONGODB_URI',
  MONGODB_CORE_DBNAME = 'MONGODB_CORE_DBNAME',
  LOGGER_LEVEL = 'LOGGER_LEVEL',
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT = 'OTEL_EXPORTER_OTLP_TRACES_ENDPOINT',
  PROMETHEUS_PORT = 'PROMETHEUS_PORT',
  SERVICE_NAME = 'SERVICE_NAME',
  SERVICE_VERSION = 'SERVICE_VERSION',
}

const defaults: Record<EnvKey, string> = {
  [EnvKey.PORT]: '3000',
  [EnvKey.NODE_ENV]: 'development',
  [EnvKey.MONGODB_URI]: 'mongodb://localhost:27017',
  [EnvKey.MONGODB_CORE_DBNAME]: 'idm-core-db',
  [EnvKey.LOGGER_LEVEL]: 'info',
  [EnvKey.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT]: 'http://jaeger:4318/v1/traces',
  [EnvKey.PROMETHEUS_PORT]: '9090',
  [EnvKey.SERVICE_NAME]: 'backend-koa',
  [EnvKey.SERVICE_VERSION]: '1.0.0',
};

@Configuration(EnvSymbol)
export class Env {
  private dbCache: Partial<Record<EnvKey, string>> = {};
  private mongodb?: MongoDB;

  constructor() {
    config({ path: path.resolve(process.cwd(), '.env') });

    if (process.env.NODE_ENV === 'development') {
      config({ path: path.resolve(process.cwd(), '.env.development.local') });
    }

    if (process.env.NODE_ENV === 'test') {
      config({ path: path.resolve(process.cwd(), '.env.test') });
    }
  }

  setMongoDB(mongodb: MongoDB): void {
    this.mongodb = mongodb;
  }

  async loadFromDb(): Promise<void> {
    if (!this.mongodb) return;

    const config = await this.mongodb
      .getCoreDb()
      .collection('config')
      .findOne({ key: 'env' });

    if (config?.values) {
      Object.entries(config.values).forEach(([key, value]) => {
        this.dbCache[key as EnvKey] = value as string;
      });
    }
  }

  setDbValue(key: EnvKey, value: string): void {
    this.dbCache[key] = value;
  }

  clearDbCache(): void {
    this.dbCache = {};
  }

  get(key: EnvKey): string {
    return process.env[key] || this.dbCache[key] || defaults[key];
  }
}
