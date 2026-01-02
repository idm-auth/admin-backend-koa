import { AbstractModule } from 'koa-inversify-framework/abstract';
import {
  SystemSetupController,
  SystemSetupControllerSymbol,
} from '@/domain/core/system-setup/system-setup.controller';
import {
  SystemSetupRepository,
  SystemSetupRepositorySymbol,
} from '@/domain/core/system-setup/system-setup.repository';
import {
  SystemSetupService,
  SystemSetupServiceSymbol,
} from '@/domain/core/system-setup/system-setup.service';

export class SystemSetupModule extends AbstractModule {
  protected runBind(): void {
    this.container
      .bind(SystemSetupRepositorySymbol)
      .to(SystemSetupRepository)
      .inSingletonScope();
    this.container
      .bind(SystemSetupServiceSymbol)
      .to(SystemSetupService)
      .inSingletonScope();
    this.container
      .bind(SystemSetupControllerSymbol)
      .to(SystemSetupController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return SystemSetupControllerSymbol;
  }
}
