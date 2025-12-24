import { AbstractCrudMapper, MapperSchemas } from 'koa-inversify-framework/abstract';
import { Mapper } from 'koa-inversify-framework/stereotype';
import { GroupRoleDtoTypes, groupRoleBaseResponseSchema } from '@/domain/realm/group-role/group-role.dto';
import { GroupRoleSchema } from '@/domain/realm/group-role/group-role.entity';

export const GroupRoleMapperSymbol = Symbol.for('GroupRoleMapper');

@Mapper(GroupRoleMapperSymbol)
export class GroupRoleMapper extends AbstractCrudMapper<GroupRoleSchema, GroupRoleDtoTypes> {
  constructor() {
    const schemas: MapperSchemas<GroupRoleDtoTypes> = {
      createResponseSchema: groupRoleBaseResponseSchema,
      findByIdResponseSchema: groupRoleBaseResponseSchema,
      findOneResponseSchema: groupRoleBaseResponseSchema,
      updateResponseSchema: groupRoleBaseResponseSchema,
      deleteResponseSchema: groupRoleBaseResponseSchema,
      paginatedItemSchema: groupRoleBaseResponseSchema,
    };
    super(schemas);
  }
}
