import { AbstractModule } from 'koa-inversify-framework/abstract';
import {
  CoreApplicationConfigurationController,
  CoreApplicationConfigurationControllerSymbol,
} from '@/domain/core/application-configuration/application-configuration.controller';

export class CoreApplicationConfigurationModule extends AbstractModule {
  protected runBind(): void {
    this.container
      .bind(CoreApplicationConfigurationControllerSymbol)
      .to(CoreApplicationConfigurationController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return CoreApplicationConfigurationControllerSymbol;
  }
}
