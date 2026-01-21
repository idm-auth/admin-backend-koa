import { AbstractCrudMapper, MapperSchemas } from 'koa-inversify-framework/abstract';
import { Mapper } from 'koa-inversify-framework/stereotype';
import { PolicyActionDtoTypes, policyActionBaseResponseSchema } from '@/domain/realm/policy-action/policy-action.dto';
import { PolicyActionSchema } from '@/domain/realm/policy-action/policy-action.entity';

export const PolicyActionMapperSymbol = Symbol.for('PolicyActionMapper');

@Mapper(PolicyActionMapperSymbol)
export class PolicyActionMapper extends AbstractCrudMapper<PolicyActionSchema, PolicyActionDtoTypes> {
  constructor() {
    const schemas: MapperSchemas<PolicyActionDtoTypes> = {
      createResponseSchema: policyActionBaseResponseSchema,
      findByIdResponseSchema: policyActionBaseResponseSchema,
      findOneResponseSchema: policyActionBaseResponseSchema,
      updateResponseSchema: policyActionBaseResponseSchema,
      deleteResponseSchema: policyActionBaseResponseSchema,
      paginatedItemSchema: policyActionBaseResponseSchema,
    };
    super(schemas);
  }
}
