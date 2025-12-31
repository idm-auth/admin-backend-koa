import { RealmDtoTypes } from '@/domain/core/realm/realm.dto';
import { RealmEntity, RealmSchema } from '@/domain/core/realm/realm.entity';
import {
  RealmRepository,
  RealmRepositorySymbol,
} from '@/domain/core/realm/realm.repository';
import { inject } from 'inversify';
import { AbstractCrudService, AbstractEnv } from 'koa-inversify-framework/abstract';
import { CreateInput, EnvKey } from 'koa-inversify-framework/common';
import { EnvSymbol } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';

export const RealmServiceSymbol = Symbol.for('RealmService');

@Service(RealmServiceSymbol)
export class RealmService extends AbstractCrudService<
  RealmSchema,
  RealmDtoTypes
> {
  @inject(RealmRepositorySymbol) protected repository!: RealmRepository;
  @inject(EnvSymbol) protected env!: AbstractEnv;

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

  async findByPublicUUID(publicUUID: string): Promise<RealmEntity> {
    this.log.debug({ publicUUID }, 'Finding by publicUUID');
    return this.repository.findByPublicUUID(publicUUID);
  }

  async findByName(name: string): Promise<RealmEntity> {
    this.log.debug({ name }, 'Finding by name');
    return this.repository.findByName(name);
  }

  async getRealmCore(): Promise<RealmEntity> {
    this.log.debug('Getting core realm');
    return this.repository.findOne({
      dbName: this.env.get(EnvKey.MONGODB_CORE_DBNAME),
    });
  }
}
