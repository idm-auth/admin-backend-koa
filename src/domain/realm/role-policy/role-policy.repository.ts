import { AbstractCrudMongoRepository } from 'koa-inversify-framework/abstract';
import { Repository } from 'koa-inversify-framework/stereotype';
import { RolePolicySchema, rolePolicySchema } from '@/domain/realm/role-policy/role-policy.entity';

export const RolePolicyRepositorySymbol = Symbol.for('RolePolicyRepository');

@Repository(RolePolicyRepositorySymbol, { multiTenant: true })
export class RolePolicyRepository extends AbstractCrudMongoRepository<RolePolicySchema> {
  constructor() {
    super(rolePolicySchema, 'role-policy');
  }
}
