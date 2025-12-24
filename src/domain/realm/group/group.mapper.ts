import { AbstractCrudMapper, MapperSchemas } from 'koa-inversify-framework/abstract';
import { Mapper } from 'koa-inversify-framework/stereotype';
import { GroupDtoTypes, groupBaseResponseSchema } from '@/domain/realm/group/group.dto';
import { GroupSchema } from '@/domain/realm/group/group.entity';

export const GroupMapperSymbol = Symbol.for('GroupMapper');

@Mapper(GroupMapperSymbol)
export class GroupMapper extends AbstractCrudMapper<GroupSchema, GroupDtoTypes> {
  constructor() {
    const schemas: MapperSchemas<GroupDtoTypes> = {
      createResponseSchema: groupBaseResponseSchema,
      findByIdResponseSchema: groupBaseResponseSchema,
      findOneResponseSchema: groupBaseResponseSchema,
      updateResponseSchema: groupBaseResponseSchema,
      deleteResponseSchema: groupBaseResponseSchema,
      paginatedItemSchema: groupBaseResponseSchema,
    };
    super(schemas);
  }
}
