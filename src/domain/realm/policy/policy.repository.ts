import { AbstractCrudMongoRepository } from 'koa-inversify-framework/abstract';
import { Repository } from 'koa-inversify-framework/stereotype';
import { PolicySchema, policySchema } from '@/domain/realm/policy/policy.entity';

export const PolicyRepositorySymbol = Symbol.for('PolicyRepository');

@Repository(PolicyRepositorySymbol, { multiTenant: true })
export class PolicyRepository extends AbstractCrudMongoRepository<PolicySchema> {
  constructor() {
    super(policySchema, 'policies');
  }
}
