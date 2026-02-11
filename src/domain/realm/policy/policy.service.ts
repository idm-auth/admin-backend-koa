import { AbstractCrudService } from '@idm-auth/koa-inversify-framework/abstract';
import { Service } from '@idm-auth/koa-inversify-framework/stereotype';
import { TraceAsync } from '@idm-auth/koa-inversify-framework/decorator';
import { PolicyDtoTypes } from '@/domain/realm/policy/policy.dto';
import {
  PolicyCreate,
  PolicyEntity,
  PolicySchema,
} from '@/domain/realm/policy/policy.entity';
import {
  PolicyRepository,
  PolicyRepositorySymbol,
} from '@/domain/realm/policy/policy.repository';
import {
  PaginationFilter,
  DocId,
} from '@idm-auth/koa-inversify-framework/common';
import { IdmAuthAction } from '@idm-auth/auth-client';
import { inject } from 'inversify';
import type { QueryFilter, InferSchemaType } from 'mongoose';

export const PolicyServiceSymbol = Symbol.for('PolicyService');

@Service(PolicyServiceSymbol, { multiTenant: true })
export class PolicyService extends AbstractCrudService<
  PolicySchema,
  PolicyDtoTypes,
  PolicyCreate
> {
  @inject(PolicyRepositorySymbol) protected repository!: PolicyRepository;

  protected buildPaginationFilter(
    filter: PaginationFilter
  ): QueryFilter<InferSchemaType<PolicySchema>> {
    return {};
  }

  protected buildCreateDataFromDto(
    dto: PolicyDtoTypes['CreateRequestDto']
  ): PolicyCreate {
    return {
      version: dto.version,
      name: dto.name,
      description: dto.description,
      effect: dto.effect,
    };
  }

  protected buildUpdate(
    entity: PolicyEntity,
    dto: PolicyDtoTypes['UpdateRequestDto']
  ): PolicyEntity {
    if (dto.version !== undefined) entity.version = dto.version;
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.effect !== undefined) entity.effect = dto.effect;
    return entity;
  }

  @TraceAsync('policy.service.findByAccountAndActions')
  async findByAccountAndActions(
    accountId: DocId,
    action: IdmAuthAction
  ): Promise<PolicyEntity[]> {
    return this.repository.findByAccountAndActions(accountId, action);
  }
}
