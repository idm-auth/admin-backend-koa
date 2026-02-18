import {
  AbstractCrudMapper,
  MapperSchemas,
} from '@idm-auth/koa-inversify-framework/abstract';
import { Mapper } from '@idm-auth/koa-inversify-framework/stereotype';
import {
  RolePolicyDtoTypes,
  rolePolicyBaseResponseSchema,
} from '@/domain/realm/role-policy/role-policy.dto';
import { RolePolicySchema } from '@/domain/realm/role-policy/role-policy.entity';

export const RolePolicyMapperSymbol = Symbol.for('RolePolicyMapper');

@Mapper(RolePolicyMapperSymbol)
export class RolePolicyMapper extends AbstractCrudMapper<
  RolePolicySchema,
  RolePolicyDtoTypes
> {
  constructor() {
    const schemas: MapperSchemas<RolePolicyDtoTypes> = {
      createResponseSchema: rolePolicyBaseResponseSchema,
      findByIdResponseSchema: rolePolicyBaseResponseSchema,
      findOneResponseSchema: rolePolicyBaseResponseSchema,
      updateResponseSchema: rolePolicyBaseResponseSchema,
      deleteResponseSchema: rolePolicyBaseResponseSchema,
      paginatedItemSchema: rolePolicyBaseResponseSchema,
    };
    super(schemas);
  }
}
