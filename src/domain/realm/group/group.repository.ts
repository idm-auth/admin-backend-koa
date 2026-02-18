import { AbstractCrudMongoRepository } from '@idm-auth/koa-inversify-framework/abstract';
import { Repository } from '@idm-auth/koa-inversify-framework/stereotype';
import { GroupSchema, groupSchema } from '@/domain/realm/group/group.entity';

export const GroupRepositorySymbol = Symbol.for('GroupRepository');

@Repository(GroupRepositorySymbol, { multiTenant: true })
export class GroupRepository extends AbstractCrudMongoRepository<GroupSchema> {
  constructor() {
    super(groupSchema, 'group');
  }
}
