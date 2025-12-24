import { AbstractCrudMapper, MapperSchemas } from 'koa-inversify-framework/abstract';
import { Mapper } from 'koa-inversify-framework/stereotype';
import { RealmDtoTypes, realmFullResponseSchema, realmListItemResponseSchema } from '@/domain/core/realm/realm.dto';
import { RealmSchema } from '@/domain/core/realm/realm.entity';

export const RealmMapperSymbol = Symbol.for('RealmMapper');

@Mapper(RealmMapperSymbol)
export class RealmMapper extends AbstractCrudMapper<RealmSchema, RealmDtoTypes> {
  constructor() {
    const schemas: MapperSchemas<RealmDtoTypes> = {
      createResponseSchema: realmFullResponseSchema,
      findByIdResponseSchema: realmFullResponseSchema,
      findOneResponseSchema: realmFullResponseSchema,
      updateResponseSchema: realmFullResponseSchema,
      deleteResponseSchema: realmFullResponseSchema,
      paginatedItemSchema: realmListItemResponseSchema,
    };
    super(schemas);
  }
}
