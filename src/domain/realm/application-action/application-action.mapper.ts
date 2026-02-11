import {
  AbstractCrudMapper,
  MapperSchemas,
} from '@idm-auth/koa-inversify-framework/abstract';
import { Mapper } from '@idm-auth/koa-inversify-framework/stereotype';
import {
  ApplicationActionDtoTypes,
  applicationActionBaseResponseSchema,
} from '@/domain/realm/application-action/application-action.dto';
import { ApplicationActionSchema } from '@/domain/realm/application-action/application-action.entity';

export const ApplicationActionMapperSymbol = Symbol.for(
  'ApplicationActionMapper'
);

@Mapper(ApplicationActionMapperSymbol)
export class ApplicationActionMapper extends AbstractCrudMapper<
  ApplicationActionSchema,
  ApplicationActionDtoTypes
> {
  constructor() {
    const schemas: MapperSchemas<ApplicationActionDtoTypes> = {
      createResponseSchema: applicationActionBaseResponseSchema,
      findByIdResponseSchema: applicationActionBaseResponseSchema,
      findOneResponseSchema: applicationActionBaseResponseSchema,
      updateResponseSchema: applicationActionBaseResponseSchema,
      deleteResponseSchema: applicationActionBaseResponseSchema,
      paginatedItemSchema: applicationActionBaseResponseSchema,
    };
    super(schemas);
  }
}
