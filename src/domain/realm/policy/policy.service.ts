import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { PolicyDtoTypes } from '@/domain/realm/policy/policy.dto';
import { PolicyCreate, PolicyEntity, PolicySchema } from '@/domain/realm/policy/policy.entity';
import { PolicyRepository, PolicyRepositorySymbol } from '@/domain/realm/policy/policy.repository';
import { PaginationFilter } from 'koa-inversify-framework/common';
import { inject } from 'inversify';
import type { QueryFilter, InferSchemaType } from 'mongoose';

export const PolicyServiceSymbol = Symbol.for('PolicyService');

@Service(PolicyServiceSymbol, { multiTenant: true })
export class PolicyService extends AbstractCrudService<PolicySchema, PolicyDtoTypes, PolicyCreate> {
  @inject(PolicyRepositorySymbol) protected repository!: PolicyRepository;

  protected buildPaginationFilter(
    filter: PaginationFilter
  ): QueryFilter<InferSchemaType<PolicySchema>> {
    return {};
  }

  protected buildCreateDataFromDto(dto: PolicyDtoTypes['CreateRequestDto']): PolicyCreate {
    return {
      version: dto.version || '2025-12-24',
      name: dto.name,
      description: dto.description,
      effect: dto.effect,
      actions: dto.actions,
      resources: dto.resources,
    };
  }

  protected buildUpdate(entity: PolicyEntity, dto: PolicyDtoTypes['UpdateRequestDto']): PolicyEntity {
    if (dto.version !== undefined) entity.version = dto.version;
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.effect !== undefined) entity.effect = dto.effect;
    if (dto.actions !== undefined) entity.actions = dto.actions;
    if (dto.resources !== undefined) entity.resources = dto.resources;
    return entity;
  }
}
