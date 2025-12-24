import { AbstractMongoRepository } from 'koa-inversify-framework/abstract';
import { Repository } from 'koa-inversify-framework/stereotype';
import { GroupRoleSchema, groupRoleSchema } from '@/domain/realm/group-role/group-role.entity';

export const GroupRoleRepositorySymbol = Symbol.for('GroupRoleRepository');

@Repository(GroupRoleRepositorySymbol, { multiTenant: true })
export class GroupRoleRepository extends AbstractMongoRepository<GroupRoleSchema> {
  constructor() {
    super(groupRoleSchema, 'group-roles');
  }
}
