import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { GroupRoleDtoTypes } from '@/domain/realm/group-role/group-role.dto';
import { GroupRoleCreate, GroupRoleEntity, GroupRoleSchema } from '@/domain/realm/group-role/group-role.entity';
import { GroupRoleRepository, GroupRoleRepositorySymbol } from '@/domain/realm/group-role/group-role.repository';
import { inject } from 'inversify';

export const GroupRoleServiceSymbol = Symbol.for('GroupRoleService');

@Service(GroupRoleServiceSymbol, { multiTenant: true })
export class GroupRoleService extends AbstractCrudService<GroupRoleSchema, GroupRoleDtoTypes, GroupRoleCreate> {
  @inject(GroupRoleRepositorySymbol) protected repository!: GroupRoleRepository;

  protected buildCreateDataFromDto(dto: GroupRoleDtoTypes['CreateRequestDto']): GroupRoleCreate {
    return {
      groupId: dto.groupId,
      roleId: dto.roleId,
    };
  }

  protected buildUpdate(entity: GroupRoleEntity, dto: GroupRoleDtoTypes['UpdateRequestDto']): GroupRoleEntity {
    return entity;
  }
}
