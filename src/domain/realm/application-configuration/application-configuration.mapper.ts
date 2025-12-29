import { AbstractCrudMapper, MapperSchemas } from 'koa-inversify-framework/abstract';
import { Mapper } from 'koa-inversify-framework/stereotype';
import {
  ApplicationConfigurationDtoTypes,
  applicationConfigurationResponseSchema,
} from '@/domain/realm/application-configuration/application-configuration.dto';
import { ApplicationConfigurationSchema } from '@/domain/realm/application-configuration/application-configuration.entity';

export const ApplicationConfigurationMapperSymbol = Symbol.for('ApplicationConfigurationMapper');

@Mapper(ApplicationConfigurationMapperSymbol)
export class ApplicationConfigurationMapper extends AbstractCrudMapper<
  ApplicationConfigurationSchema,
  ApplicationConfigurationDtoTypes
> {
  constructor() {
    const schemas: MapperSchemas<ApplicationConfigurationDtoTypes> = {
      createResponseSchema: applicationConfigurationResponseSchema,
      findByIdResponseSchema: applicationConfigurationResponseSchema,
      findOneResponseSchema: applicationConfigurationResponseSchema,
      updateResponseSchema: applicationConfigurationResponseSchema,
      deleteResponseSchema: applicationConfigurationResponseSchema,
      paginatedItemSchema: applicationConfigurationResponseSchema,
    };
    super(schemas);
  }
}
