import { AbstractEnv } from 'koa-inversify-framework';
import { EnvKey } from 'koa-inversify-framework/common';
import { Configuration } from 'koa-inversify-framework/stereotype';

export enum AppEnvKey {
  IDM_AUTH_SYSTEM_ID = 'IDM_AUTH_SYSTEM_ID',
}

export const AppEnvSymbol = Symbol.for('AppEnv');

@Configuration(AppEnvSymbol)
export class AppEnv extends AbstractEnv {
  constructor() {
    super();
    this.defaults[EnvKey.APPLICATION_NAME] = 'idm-core-backend-api';
    this.defaults[AppEnvKey.IDM_AUTH_SYSTEM_ID] = 'idm-auth-system';
  }
}
