import { AbstractModule } from 'koa-inversify-framework/abstract';
import {
  SystemSetupController,
  SystemSetupCoreControllerSymbol,
} from '@/domain/core/system-setup/system-setup.controller';
import {
  SystemSetupRepository,
  SystemSetupCoreRepositorySymbol,
} from '@/domain/core/system-setup/system-setup.repository';
import {
  SystemSetupService,
  SystemSetupCoreServiceSymbol,
} from '@/domain/core/system-setup/system-setup.service';

export class SystemSetupModule extends AbstractModule {
  protected runBind(): void {
    this.container
      .bind(SystemSetupCoreRepositorySymbol)
      .to(SystemSetupRepository)
      .inSingletonScope();
    this.container
      .bind(SystemSetupCoreServiceSymbol)
      .to(SystemSetupService)
      .inSingletonScope();
    this.container
      .bind(SystemSetupCoreControllerSymbol)
      .to(SystemSetupController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return SystemSetupCoreControllerSymbol;
  }
}
