import { AbstractService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { CreateInput } from 'koa-inversify-framework/common';
import { RealmDtoTypes } from '@/domain/core/realm/realm.dto';
import { RealmEntity, RealmSchema } from '@/domain/core/realm/realm.entity';
import { RealmRepository, RealmRepositorySymbol } from '@/domain/core/realm/realm.repository';
import { inject } from 'inversify';

export const RealmServiceSymbol = Symbol.for('RealmService');

@Service(RealmServiceSymbol)
export class RealmService extends AbstractService<RealmSchema, RealmDtoTypes> {
  @inject(RealmRepositorySymbol) protected repository!: RealmRepository;

  protected buildCreateData(
    dto: RealmDtoTypes['CreateRequestDto']
  ): CreateInput<RealmSchema> {
    this.log.debug({ dto }, 'Building create data');
    return {
      name: dto.name,
      description: dto.description,
      dbName: dto.dbName,
      jwtConfig: {
        expiresIn: dto.jwtConfig?.expiresIn || '24h',
      },
    };
  }

  protected buildUpdate(
    entity: RealmEntity,
    dto: RealmDtoTypes['UpdateRequestDto']
  ): RealmEntity {
    this.log.debug({ id: entity._id, dto }, 'Building update');
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.jwtConfig?.expiresIn !== undefined) {
      entity.jwtConfig.expiresIn = dto.jwtConfig.expiresIn;
    }
    return entity;
  }

  async findByPublicUUID(publicUUID: string): Promise<RealmEntity | null> {
    this.log.debug({ publicUUID }, 'Finding by publicUUID');
    return this.repository.findByPublicUUID(publicUUID);
  }

  async findByName(name: string): Promise<RealmEntity | null> {
    this.log.debug({ name }, 'Finding by name');
    return this.repository.findByName(name);
  }
}
