import { ApplicationConfigurationEntity } from '@/domain/realm/application-configuration/application-configuration.entity';

export const BACKEND_API_APPLICATION_NAME = 'idm-core-backend-api';

export type BackendApiConfig = {
  jwt: {
    secret: string;
    accessTokenExpiresIn: string;
    refreshTokenExpiresIn: string;
  };
};

export type BackendApiConfigEntity = Omit<ApplicationConfigurationEntity, 'config'> & {
  config: BackendApiConfig;
};

export function isBackendApiConfig(config: any): config is BackendApiConfig {
  return (
    config &&
    typeof config === 'object' &&
    config.jwt &&
    typeof config.jwt === 'object' &&
    typeof config.jwt.secret === 'string' &&
    typeof config.jwt.accessTokenExpiresIn === 'string' &&
    typeof config.jwt.refreshTokenExpiresIn === 'string'
  );
}
