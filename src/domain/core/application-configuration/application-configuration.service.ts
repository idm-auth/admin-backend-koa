import { AbstractService } from '@idm-auth/koa-inversify-framework/abstract';
import { Service } from '@idm-auth/koa-inversify-framework/stereotype';

export const CoreApplicationConfigurationServiceSymbol = Symbol.for(
  'CoreApplicationConfigurationService'
);

@Service(CoreApplicationConfigurationServiceSymbol)
export class CoreApplicationConfigurationService extends AbstractService {}
