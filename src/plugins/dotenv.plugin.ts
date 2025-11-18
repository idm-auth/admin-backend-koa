import * as dotenvLib from 'dotenv';
import path from 'path';

// cria apenas uma conexão principal
const init = async () => {
  // sempre carrega o .env padrão
  dotenvLib.config({ path: path.resolve(process.cwd(), '.env') });

  // se NODE_ENV=development, carrega também o .env.development
  if (process.env.NODE_ENV === 'development') {
    dotenvLib.config({
      path: path.resolve(process.cwd(), '.env.development.local'),
    });
  }
};

export enum EnvKey {
  API_SUPPORT_EMAIL = 'API_SUPPORT_EMAIL',
  API_MAIN_URL = 'API_MAIN_URL',
  PORT = 'PORT',
  NODE_ENV = 'NODE_ENV',
  MONGODB_URI = 'MONGODB_URI',
  MONGODB_CORE_DBNAME = 'MONGODB_CORE_DBNAME',
  JWT_SECRET = 'JWT_SECRET',
  JWT_EXPIRES_IN = 'JWT_EXPIRES_IN',
  LOGGER_LEVEL = 'LOGGER_LEVEL',
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT = 'OTEL_EXPORTER_OTLP_TRACES_ENDPOINT',
  PROMETHEUS_PORT = 'PROMETHEUS_PORT',
}

const defaults: Record<EnvKey, string> = {
  [EnvKey.API_SUPPORT_EMAIL]: 'support@idm-auth.io',
  [EnvKey.API_MAIN_URL]: 'http://localhost:3000',
  [EnvKey.PORT]: '3000',
  [EnvKey.NODE_ENV]: 'development',
  [EnvKey.MONGODB_URI]: 'mongodb://localhost:27017',
  [EnvKey.MONGODB_CORE_DBNAME]: 'idm-core-db',
  [EnvKey.JWT_SECRET]: 'your-secret-key',
  [EnvKey.JWT_EXPIRES_IN]: '24h',
  [EnvKey.LOGGER_LEVEL]: 'info',
  [EnvKey.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT]: 'http://jaeger:4318/v1/traces',
  [EnvKey.PROMETHEUS_PORT]: '9090',
};

// Cache para valores do banco
const dbCache: Partial<Record<EnvKey, string>> = {};

// Função para definir valores do banco
export const setDbValue = (key: EnvKey, value: string): void => {
  dbCache[key] = value;
};

// Função para limpar cache do banco
export const clearDbCache = (): void => {
  Object.keys(dbCache).forEach((key) => delete dbCache[key as EnvKey]);
};

// Função principal com hierarquia: ENV > DB > Default
export const getEnvValue = (key: EnvKey): string => {
  return process.env[key] || dbCache[key] || defaults[key];
};

export const dotenv = { init };
