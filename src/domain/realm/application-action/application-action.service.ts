import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { DocId, PaginationFilter } from 'koa-inversify-framework/common';
import { ApplicationActionDtoTypes } from '@/domain/realm/application-action/application-action.dto';
import {
  ApplicationActionEntity,
  ApplicationActionSchema,
  ApplicationActionCreate,
} from '@/domain/realm/application-action/application-action.entity';
import {
  ApplicationActionRepository,
  ApplicationActionRepositorySymbol,
} from '@/domain/realm/application-action/application-action.repository';
import { inject } from 'inversify';
import type { QueryFilter, InferSchemaType } from 'mongoose';

export const ApplicationActionServiceSymbol = Symbol.for(
  'ApplicationActionService'
);

@Service(ApplicationActionServiceSymbol, { multiTenant: true })
export class ApplicationActionService extends AbstractCrudService<
  ApplicationActionSchema,
  ApplicationActionDtoTypes,
  ApplicationActionCreate
> {
  @inject(ApplicationActionRepositorySymbol)
  protected repository!: ApplicationActionRepository;

  protected buildCreateDataFromDto(
    dto: ApplicationActionDtoTypes['CreateRequestDto']
  ): ApplicationActionCreate {
    return {
      applicationId: dto.applicationId,
      resourceType: dto.resourceType,
      pathPattern: dto.pathPattern,
      operations: dto.operations,
    };
  }

  protected buildUpdate(
    entity: ApplicationActionEntity,
    dto: ApplicationActionDtoTypes['UpdateRequestDto']
  ): ApplicationActionEntity {
    entity.operations = dto.operations;
    return entity;
  }

  protected buildPaginationFilter(
    filter: PaginationFilter
  ): QueryFilter<InferSchemaType<ApplicationActionSchema>> {
    const query: QueryFilter<InferSchemaType<ApplicationActionSchema>> = {};

    if (filter?.applicationId) {
      query.applicationId = filter.applicationId as string;
    }

    return query;
  }

  @TraceAsync('application-action.service.findByApplicationId')
  async findByApplicationId(
    applicationId: DocId
  ): Promise<ApplicationActionEntity[]> {
    return this.repository.findMany({ applicationId });
  }

  @TraceAsync('application-action.service.findByResourceType')
  async findByResourceType(
    resourceType: string
  ): Promise<ApplicationActionEntity[]> {
    return this.repository.findMany({ resourceType });
  }

  @TraceAsync('application-action.service.deleteByApplicationId')
  async deleteByApplicationId(applicationId: DocId): Promise<number> {
    const result = await this.repository.deleteMany({ applicationId });
    return result.deletedCount;
  }
}
