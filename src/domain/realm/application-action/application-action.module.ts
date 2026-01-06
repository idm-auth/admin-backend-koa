import { AbstractModule } from 'koa-inversify-framework/abstract';
import { ApplicationActionController, ApplicationActionControllerSymbol } from '@/domain/realm/application-action/application-action.controller';
import { ApplicationActionMapper, ApplicationActionMapperSymbol } from '@/domain/realm/application-action/application-action.mapper';
import { ApplicationActionRepository, ApplicationActionRepositorySymbol } from '@/domain/realm/application-action/application-action.repository';
import { ApplicationActionService, ApplicationActionServiceSymbol } from '@/domain/realm/application-action/application-action.service';

export class ApplicationActionModule extends AbstractModule {
  protected runBind(): void {
    this.container.bind(ApplicationActionRepositorySymbol).to(ApplicationActionRepository).inSingletonScope();
    this.container.bind(ApplicationActionMapperSymbol).to(ApplicationActionMapper).inSingletonScope();
    this.container.bind(ApplicationActionServiceSymbol).to(ApplicationActionService).inSingletonScope();
    this.container.bind(ApplicationActionControllerSymbol).to(ApplicationActionController).inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return ApplicationActionControllerSymbol;
  }
}
