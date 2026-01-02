import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { GroupDtoTypes } from '@/domain/realm/group/group.dto';
import { GroupCreate, GroupEntity, GroupSchema } from '@/domain/realm/group/group.entity';
import { GroupRepository, GroupRepositorySymbol } from '@/domain/realm/group/group.repository';
import { inject } from 'inversify';

export const GroupServiceSymbol = Symbol.for('GroupService');

@Service(GroupServiceSymbol, { multiTenant: true })
export class GroupService extends AbstractCrudService<GroupSchema, GroupDtoTypes, GroupCreate> {
  @inject(GroupRepositorySymbol) protected repository!: GroupRepository;

  protected buildCreateDataFromDto(dto: GroupDtoTypes['CreateRequestDto']): GroupCreate {
    return {
      name: dto.name,
      description: dto.description,
    };
  }

  protected buildUpdate(entity: GroupEntity, dto: GroupDtoTypes['UpdateRequestDto']): GroupEntity {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.description !== undefined) entity.description = dto.description;
    return entity;
  }
}
