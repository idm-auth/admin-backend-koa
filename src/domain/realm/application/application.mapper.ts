import { AbstractMapper, MapperSchemas } from 'koa-inversify-framework/abstract';
import { Mapper } from 'koa-inversify-framework/stereotype';
import { ApplicationDtoTypes, applicationBaseResponseSchema } from '@/domain/realm/application/application.dto';
import { ApplicationSchema } from '@/domain/realm/application/application.entity';

export const ApplicationMapperSymbol = Symbol.for('ApplicationMapper');

@Mapper(ApplicationMapperSymbol)
export class ApplicationMapper extends AbstractMapper<ApplicationSchema, ApplicationDtoTypes> {
  constructor() {
    const schemas: MapperSchemas<ApplicationDtoTypes> = {
      createResponseSchema: applicationBaseResponseSchema,
      findByIdResponseSchema: applicationBaseResponseSchema,
      findOneResponseSchema: applicationBaseResponseSchema,
      updateResponseSchema: applicationBaseResponseSchema,
      deleteResponseSchema: applicationBaseResponseSchema,
      paginatedItemSchema: applicationBaseResponseSchema,
    };
    super(schemas);
  }
}
