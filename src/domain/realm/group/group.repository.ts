import { AbstractMongoRepository } from 'koa-inversify-framework/abstract';
import { Repository } from 'koa-inversify-framework/stereotype';
import { GroupSchema, groupSchema } from '@/domain/realm/group/group.entity';

export const GroupRepositorySymbol = Symbol.for('GroupRepository');

@Repository(GroupRepositorySymbol, { multiTenant: true })
export class GroupRepository extends AbstractMongoRepository<GroupSchema> {
  constructor() {
    super(groupSchema, 'groups');
  }
}
