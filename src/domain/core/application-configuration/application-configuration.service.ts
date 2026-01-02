import { AbstractService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';

export const CoreApplicationConfigurationServiceSymbol = Symbol.for(
  'CoreApplicationConfigurationService'
);

@Service(CoreApplicationConfigurationServiceSymbol)
export class CoreApplicationConfigurationService extends AbstractService {}
