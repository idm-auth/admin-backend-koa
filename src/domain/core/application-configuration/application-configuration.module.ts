import { AbstractModule } from 'koa-inversify-framework/abstract';
import { Container } from 'inversify';
import {
  CoreApplicationConfigurationController,
  CoreApplicationConfigurationControllerSymbol,
} from '@/domain/core/application-configuration/application-configuration.controller';
import {
  CoreApplicationConfigurationService,
  CoreApplicationConfigurationServiceSymbol,
} from '@/domain/core/application-configuration/application-configuration.service';

export class CoreApplicationConfigurationModule extends AbstractModule {
  constructor(container: Container) {
    super(container);
  }

  protected runBind(): void {
    this.container
      .bind(CoreApplicationConfigurationServiceSymbol)
      .to(CoreApplicationConfigurationService)
      .inSingletonScope();

    this.container
      .bind(CoreApplicationConfigurationControllerSymbol)
      .to(CoreApplicationConfigurationController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return CoreApplicationConfigurationControllerSymbol;
  }
}
