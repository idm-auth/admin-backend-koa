import { AbstractMapper, MapperSchemas } from 'koa-inversify-framework/abstract';
import { Mapper } from 'koa-inversify-framework/stereotype';
import { PolicyDtoTypes, policyBaseResponseSchema } from '@/domain/realm/policy/policy.dto';
import { PolicySchema } from '@/domain/realm/policy/policy.entity';

export const PolicyMapperSymbol = Symbol.for('PolicyMapper');

@Mapper(PolicyMapperSymbol)
export class PolicyMapper extends AbstractMapper<PolicySchema, PolicyDtoTypes> {
  constructor() {
    const schemas: MapperSchemas<PolicyDtoTypes> = {
      createResponseSchema: policyBaseResponseSchema,
      findByIdResponseSchema: policyBaseResponseSchema,
      findOneResponseSchema: policyBaseResponseSchema,
      updateResponseSchema: policyBaseResponseSchema,
      deleteResponseSchema: policyBaseResponseSchema,
      paginatedItemSchema: policyBaseResponseSchema,
    };
    super(schemas);
  }
}
