import { AbstractModule } from 'koa-inversify-framework/abstract';
import { GroupController, GroupControllerSymbol } from '@/domain/realm/group/group.controller';
import { GroupMapper, GroupMapperSymbol } from '@/domain/realm/group/group.mapper';
import { GroupRepository, GroupRepositorySymbol } from '@/domain/realm/group/group.repository';
import { GroupService, GroupServiceSymbol } from '@/domain/realm/group/group.service';

export class GroupModule extends AbstractModule {
  protected runBind(): void {
    this.container.bind(GroupRepositorySymbol).to(GroupRepository).inSingletonScope();
    this.container.bind(GroupMapperSymbol).to(GroupMapper).inSingletonScope();
    this.container.bind(GroupServiceSymbol).to(GroupService).inSingletonScope();
    this.container.bind(GroupControllerSymbol).to(GroupController).inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return GroupControllerSymbol;
  }
}
