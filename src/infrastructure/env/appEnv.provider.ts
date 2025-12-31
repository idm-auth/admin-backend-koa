import { AbstractEnv, EnvSymbol } from 'koa-inversify-framework/abstract';
import { EnvKey } from 'koa-inversify-framework/common';
import { Configuration } from 'koa-inversify-framework/stereotype';

export enum AppEnvKey {}

@Configuration(EnvSymbol)
export class AppEnv extends AbstractEnv {
  constructor() {
    super();
    this.defaults[EnvKey.APPLICATION_NAME] = 'idm-core-backend-api';
  }
}
