import { Container } from 'inversify';
import { AbstractModule } from '@idm-auth/koa-inversify-framework/abstract';
import {
  RealmController,
  RealmControllerSymbol,
} from '@/domain/core/realm/realm.controller';
import {
  RealmService,
  RealmServiceSymbol,
} from '@/domain/core/realm/realm.service';
import {
  RealmRepository,
  RealmRepositorySymbol,
} from '@/domain/core/realm/realm.repository';
import {
  RealmMapper,
  RealmMapperSymbol,
} from '@/domain/core/realm/realm.mapper';

export class RealmModule extends AbstractModule {
  constructor(container: Container) {
    super(container);
  }

  protected runBind(): void {
    this.container
      .bind(RealmRepositorySymbol)
      .to(RealmRepository)
      .inSingletonScope();
    this.container.bind(RealmMapperSymbol).to(RealmMapper).inSingletonScope();
    this.container.bind(RealmServiceSymbol).to(RealmService).inSingletonScope();
    this.container
      .bind(RealmControllerSymbol)
      .to(RealmController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return RealmControllerSymbol;
  }
}
