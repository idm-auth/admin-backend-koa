import { AbstractCrudService } from '@idm-auth/koa-inversify-framework/abstract';
import { Service } from '@idm-auth/koa-inversify-framework/stereotype';
import { RoleDtoTypes } from '@/domain/realm/role/role.dto';
import {
  RoleCreate,
  RoleEntity,
  RoleSchema,
} from '@/domain/realm/role/role.entity';
import {
  RoleRepository,
  RoleRepositorySymbol,
} from '@/domain/realm/role/role.repository';
import { PaginationFilter } from '@idm-auth/koa-inversify-framework/common';
import { inject } from 'inversify';
import type { QueryFilter, InferSchemaType } from 'mongoose';

export const RoleServiceSymbol = Symbol.for('RoleService');

@Service(RoleServiceSymbol, { multiTenant: true })
export class RoleService extends AbstractCrudService<
  RoleSchema,
  RoleDtoTypes,
  RoleCreate
> {
  @inject(RoleRepositorySymbol) protected repository!: RoleRepository;

  protected buildPaginationFilter(
    filter: PaginationFilter
  ): QueryFilter<InferSchemaType<RoleSchema>> {
    return {};
  }

  protected buildCreateDataFromDto(
    dto: RoleDtoTypes['CreateRequestDto']
  ): RoleCreate {
    return {
      name: dto.name,
      description: dto.description,
      permissions: dto.permissions || [],
    };
  }

  protected buildUpdate(
    entity: RoleEntity,
    dto: RoleDtoTypes['UpdateRequestDto']
  ): RoleEntity {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.permissions !== undefined) entity.permissions = dto.permissions;
    return entity;
  }
}
