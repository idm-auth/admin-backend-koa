import { AbstractCrudMongoRepository } from '@idm-auth/koa-inversify-framework/abstract';
import { Repository } from '@idm-auth/koa-inversify-framework/stereotype';
import {
  GroupRoleSchema,
  groupRoleSchema,
} from '@/domain/realm/group-role/group-role.entity';

export const GroupRoleRepositorySymbol = Symbol.for('GroupRoleRepository');

@Repository(GroupRoleRepositorySymbol, { multiTenant: true })
export class GroupRoleRepository extends AbstractCrudMongoRepository<GroupRoleSchema> {
  constructor() {
    super(groupRoleSchema, 'group-role');
  }
}
