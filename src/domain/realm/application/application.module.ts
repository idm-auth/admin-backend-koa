import { AbstractModule } from 'koa-inversify-framework/abstract';
import { ApplicationController, ApplicationControllerSymbol } from '@/domain/realm/application/application.controller';
import { ApplicationMapper, ApplicationMapperSymbol } from '@/domain/realm/application/application.mapper';
import { ApplicationRepository, ApplicationRepositorySymbol } from '@/domain/realm/application/application.repository';
import { ApplicationService, ApplicationServiceSymbol } from '@/domain/realm/application/application.service';

export class ApplicationModule extends AbstractModule {
  protected runBind(): void {
    this.container.bind(ApplicationRepositorySymbol).to(ApplicationRepository).inSingletonScope();
    this.container.bind(ApplicationMapperSymbol).to(ApplicationMapper).inSingletonScope();
    this.container.bind(ApplicationServiceSymbol).to(ApplicationService).inSingletonScope();
    this.container.bind(ApplicationControllerSymbol).to(ApplicationController).inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return ApplicationControllerSymbol;
  }
}
