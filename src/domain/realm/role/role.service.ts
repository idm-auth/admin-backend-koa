import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { CreateInput } from 'koa-inversify-framework/common';
import { RoleDtoTypes } from '@/domain/realm/role/role.dto';
import { RoleEntity, RoleSchema } from '@/domain/realm/role/role.entity';
import { RoleRepository, RoleRepositorySymbol } from '@/domain/realm/role/role.repository';
import { inject } from 'inversify';

export const RoleServiceSymbol = Symbol.for('RoleService');

@Service(RoleServiceSymbol, { multiTenant: true })
export class RoleService extends AbstractCrudService<RoleSchema, RoleDtoTypes> {
  @inject(RoleRepositorySymbol) protected repository!: RoleRepository;

  protected buildCreateData(dto: RoleDtoTypes['CreateRequestDto']): CreateInput<RoleSchema> {
    return {
      name: dto.name,
      description: dto.description,
      permissions: dto.permissions || [],
    };
  }

  protected buildUpdate(entity: RoleEntity, dto: RoleDtoTypes['UpdateRequestDto']): RoleEntity {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.permissions !== undefined) entity.permissions = dto.permissions;
    return entity;
  }
}
