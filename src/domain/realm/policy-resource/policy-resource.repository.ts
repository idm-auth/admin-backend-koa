import { AbstractCrudMongoRepository } from '@idm-auth/koa-inversify-framework/abstract';
import { Repository } from '@idm-auth/koa-inversify-framework/stereotype';
import {
  PolicyResourceSchema,
  policyResourceSchema,
} from '@/domain/realm/policy-resource/policy-resource.entity';

export const PolicyResourceRepositorySymbol = Symbol.for(
  'PolicyResourceRepository'
);

@Repository(PolicyResourceRepositorySymbol, { multiTenant: true })
export class PolicyResourceRepository extends AbstractCrudMongoRepository<PolicyResourceSchema> {
  constructor() {
    super(policyResourceSchema, 'policy-resource');
  }
}
