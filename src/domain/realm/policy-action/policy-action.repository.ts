import { AbstractCrudMongoRepository } from '@idm-auth/koa-inversify-framework/abstract';
import { Repository } from '@idm-auth/koa-inversify-framework/stereotype';
import {
  PolicyActionSchema,
  policyActionSchema,
} from '@/domain/realm/policy-action/policy-action.entity';

export const PolicyActionRepositorySymbol = Symbol.for(
  'PolicyActionRepository'
);

@Repository(PolicyActionRepositorySymbol, { multiTenant: true })
export class PolicyActionRepository extends AbstractCrudMongoRepository<PolicyActionSchema> {
  constructor() {
    super(policyActionSchema, 'policy-action');
  }
}
