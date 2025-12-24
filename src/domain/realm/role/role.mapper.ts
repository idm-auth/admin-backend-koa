import { AbstractCrudMapper, MapperSchemas } from 'koa-inversify-framework/abstract';
import { Mapper } from 'koa-inversify-framework/stereotype';
import { RoleDtoTypes, roleBaseResponseSchema } from '@/domain/realm/role/role.dto';
import { RoleSchema } from '@/domain/realm/role/role.entity';

export const RoleMapperSymbol = Symbol.for('RoleMapper');

@Mapper(RoleMapperSymbol)
export class RoleMapper extends AbstractCrudMapper<RoleSchema, RoleDtoTypes> {
  constructor() {
    const schemas: MapperSchemas<RoleDtoTypes> = {
      createResponseSchema: roleBaseResponseSchema,
      findByIdResponseSchema: roleBaseResponseSchema,
      findOneResponseSchema: roleBaseResponseSchema,
      updateResponseSchema: roleBaseResponseSchema,
      deleteResponseSchema: roleBaseResponseSchema,
      paginatedItemSchema: roleBaseResponseSchema,
    };
    super(schemas);
  }
}
