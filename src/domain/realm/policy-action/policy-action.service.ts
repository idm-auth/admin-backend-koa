import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { PolicyActionDtoTypes } from '@/domain/realm/policy-action/policy-action.dto';
import { PolicyActionEntity, PolicyActionSchema, PolicyActionCreate } from '@/domain/realm/policy-action/policy-action.entity';
import { PolicyActionRepository, PolicyActionRepositorySymbol } from '@/domain/realm/policy-action/policy-action.repository';
import { PaginationFilter } from 'koa-inversify-framework/common';
import { inject } from 'inversify';
import type { QueryFilter, InferSchemaType } from 'mongoose';

export const PolicyActionServiceSymbol = Symbol.for('PolicyActionService');

@Service(PolicyActionServiceSymbol, { multiTenant: true })
export class PolicyActionService extends AbstractCrudService<PolicyActionSchema, PolicyActionDtoTypes, PolicyActionCreate> {
  @inject(PolicyActionRepositorySymbol) protected repository!: PolicyActionRepository;

  protected buildPaginationFilter(
    filter: PaginationFilter
  ): QueryFilter<InferSchemaType<PolicyActionSchema>> {
    return {};
  }

  protected buildCreateDataFromDto(dto: PolicyActionDtoTypes['CreateRequestDto']): PolicyActionCreate {
    return {
      policyId: dto.policyId,
      system: dto.system,
      resource: dto.resource,
      operation: dto.operation,
    };
  }

  protected buildUpdate(entity: PolicyActionEntity, dto: PolicyActionDtoTypes['UpdateRequestDto']): PolicyActionEntity {
    return entity;
  }
}
