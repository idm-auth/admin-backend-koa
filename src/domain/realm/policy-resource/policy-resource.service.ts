import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { PolicyResourceDtoTypes } from '@/domain/realm/policy-resource/policy-resource.dto';
import { PolicyResourceEntity, PolicyResourceSchema, PolicyResourceCreate } from '@/domain/realm/policy-resource/policy-resource.entity';
import { PolicyResourceRepository, PolicyResourceRepositorySymbol } from '@/domain/realm/policy-resource/policy-resource.repository';
import { PaginationFilter } from 'koa-inversify-framework/common';
import { inject } from 'inversify';
import type { QueryFilter, InferSchemaType } from 'mongoose';

export const PolicyResourceServiceSymbol = Symbol.for('PolicyResourceService');

@Service(PolicyResourceServiceSymbol, { multiTenant: true })
export class PolicyResourceService extends AbstractCrudService<PolicyResourceSchema, PolicyResourceDtoTypes, PolicyResourceCreate> {
  @inject(PolicyResourceRepositorySymbol) protected repository!: PolicyResourceRepository;

  protected buildPaginationFilter(
    filter: PaginationFilter
  ): QueryFilter<InferSchemaType<PolicyResourceSchema>> {
    return {};
  }

  protected buildCreateDataFromDto(dto: PolicyResourceDtoTypes['CreateRequestDto']): PolicyResourceCreate {
    return {
      policyId: dto.policyId,
      partition: dto.partition,
      system: dto.system,
      region: dto.region,
      tenantId: dto.tenantId,
      resourcePath: dto.resourcePath,
    };
  }

  protected buildUpdate(entity: PolicyResourceEntity, dto: PolicyResourceDtoTypes['UpdateRequestDto']): PolicyResourceEntity {
    return entity;
  }
}
