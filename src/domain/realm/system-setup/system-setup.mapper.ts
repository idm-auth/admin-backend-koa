import { AbstractCrudMapper, MapperSchemas } from 'koa-inversify-framework/abstract';
import { Mapper } from 'koa-inversify-framework/stereotype';
import { SystemSetupDtoTypes, systemSetupResponseSchema } from '@/domain/realm/system-setup/system-setup.dto';
import { SystemSetupSchema } from '@/domain/shared/system-setup/system-setup.entity';

export const SystemSetupMapperSymbol = Symbol.for('SystemSetupMapper');

@Mapper(SystemSetupMapperSymbol)
export class SystemSetupMapper extends AbstractCrudMapper<SystemSetupSchema, SystemSetupDtoTypes> {
  constructor() {
    const schemas: MapperSchemas<SystemSetupDtoTypes> = {
      createResponseSchema: systemSetupResponseSchema,
      findByIdResponseSchema: systemSetupResponseSchema,
      findOneResponseSchema: systemSetupResponseSchema,
      updateResponseSchema: systemSetupResponseSchema,
      deleteResponseSchema: systemSetupResponseSchema,
      paginatedItemSchema: systemSetupResponseSchema,
    };
    super(schemas);
  }
}
