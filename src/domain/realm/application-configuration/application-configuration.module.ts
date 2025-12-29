import { AbstractModule } from 'koa-inversify-framework/abstract';
import {
  ApplicationConfigurationController,
  ApplicationConfigurationControllerSymbol,
} from '@/domain/realm/application-configuration/application-configuration.controller';
import {
  ApplicationConfigurationMapper,
  ApplicationConfigurationMapperSymbol,
} from '@/domain/realm/application-configuration/application-configuration.mapper';
import {
  ApplicationConfigurationRepository,
  ApplicationConfigurationRepositorySymbol,
} from '@/domain/realm/application-configuration/application-configuration.repository';
import {
  ApplicationConfigurationService,
  ApplicationConfigurationServiceSymbol,
} from '@/domain/realm/application-configuration/application-configuration.service';

export class ApplicationConfigurationModule extends AbstractModule {
  protected runBind(): void {
    this.container
      .bind(ApplicationConfigurationRepositorySymbol)
      .to(ApplicationConfigurationRepository)
      .inSingletonScope();
    this.container
      .bind(ApplicationConfigurationMapperSymbol)
      .to(ApplicationConfigurationMapper)
      .inSingletonScope();
    this.container
      .bind(ApplicationConfigurationServiceSymbol)
      .to(ApplicationConfigurationService)
      .inSingletonScope();
    this.container
      .bind(ApplicationConfigurationControllerSymbol)
      .to(ApplicationConfigurationController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return ApplicationConfigurationControllerSymbol;
  }
}
