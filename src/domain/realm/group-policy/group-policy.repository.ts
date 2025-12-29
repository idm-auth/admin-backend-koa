import { AbstractCrudMongoRepository } from 'koa-inversify-framework/abstract';
import { Repository } from 'koa-inversify-framework/stereotype';
import { GroupPolicySchema, groupPolicySchema } from '@/domain/realm/group-policy/group-policy.entity';

export const GroupPolicyRepositorySymbol = Symbol.for('GroupPolicyRepository');

@Repository(GroupPolicyRepositorySymbol, { multiTenant: true })
export class GroupPolicyRepository extends AbstractCrudMongoRepository<GroupPolicySchema> {
  constructor() {
    super(groupPolicySchema, 'group-policies');
  }
}
