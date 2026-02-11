import {
  AbstractCrudMapper,
  MapperSchemas,
} from '@idm-auth/koa-inversify-framework/abstract';
import { Mapper } from '@idm-auth/koa-inversify-framework/stereotype';
import {
  PolicyResourceDtoTypes,
  policyResourceBaseResponseSchema,
} from '@/domain/realm/policy-resource/policy-resource.dto';
import { PolicyResourceSchema } from '@/domain/realm/policy-resource/policy-resource.entity';

export const PolicyResourceMapperSymbol = Symbol.for('PolicyResourceMapper');

@Mapper(PolicyResourceMapperSymbol)
export class PolicyResourceMapper extends AbstractCrudMapper<
  PolicyResourceSchema,
  PolicyResourceDtoTypes
> {
  constructor() {
    const schemas: MapperSchemas<PolicyResourceDtoTypes> = {
      createResponseSchema: policyResourceBaseResponseSchema,
      findByIdResponseSchema: policyResourceBaseResponseSchema,
      findOneResponseSchema: policyResourceBaseResponseSchema,
      updateResponseSchema: policyResourceBaseResponseSchema,
      deleteResponseSchema: policyResourceBaseResponseSchema,
      paginatedItemSchema: policyResourceBaseResponseSchema,
    };
    super(schemas);
  }
}
