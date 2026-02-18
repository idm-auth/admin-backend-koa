import { AbstractEnv } from '@idm-auth/koa-inversify-framework';
import { EnvKey } from '@idm-auth/koa-inversify-framework/common';
import { Configuration } from '@idm-auth/koa-inversify-framework/stereotype';

export enum AppEnvKey {
  IDM_AUTH_CORE_API_SYSTEM_ID = 'IDM_AUTH_CORE_API_SYSTEM_ID',
  IDM_AUTH_CORE_WEB_ADMIN_SYSTEM_ID = 'IDM_AUTH_CORE_WEB_ADMIN_SYSTEM_ID',
  APPLICATION_WEB_ADMIN_NAME = 'APPLICATION_WEB_ADMIN_NAME',
  APPLICATION_WEB_ADMIN_IDM_URL = 'APPLICATION_WEB_ADMIN_IDM_URL',
}

export const AppEnvSymbol = Symbol.for('AppEnv');

@Configuration(AppEnvSymbol)
export class AppEnv extends AbstractEnv {
  constructor() {
    super();

    this.defaults[EnvKey.APPLICATION_NAME] = 'idm-auth-system';
    this.defaults[AppEnvKey.IDM_AUTH_CORE_API_SYSTEM_ID] = 'idm-auth-core-api';
    this.defaults[AppEnvKey.IDM_AUTH_CORE_WEB_ADMIN_SYSTEM_ID] =
      'idm-auth-core-web-admin';
    this.defaults[AppEnvKey.APPLICATION_WEB_ADMIN_IDM_URL] =
      'http://localhost:3000/api';
  }

  async init() {
    // TODO: Carregar conteudo do banco de dados
  }
}
