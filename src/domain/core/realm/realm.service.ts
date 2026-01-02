import { RealmDtoTypes } from '@/domain/core/realm/realm.dto';
import {
  RealmCreate,
  RealmEntity,
  RealmSchema,
} from '@/domain/core/realm/realm.entity';
import {
  RealmRepository,
  RealmRepositorySymbol,
} from '@/domain/core/realm/realm.repository';
import { inject } from 'inversify';
import { AbstractEnv, EnvSymbol } from 'koa-inversify-framework';
import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { EnvKey } from 'koa-inversify-framework/common';
import { Service } from 'koa-inversify-framework/stereotype';

export const RealmServiceSymbol = Symbol.for('RealmService');

@Service(RealmServiceSymbol)
export class RealmService extends AbstractCrudService<
  RealmSchema,
  RealmDtoTypes,
  RealmCreate
> {
  @inject(RealmRepositorySymbol) protected repository!: RealmRepository;
  @inject(EnvSymbol) protected env!: AbstractEnv;

  async create(data: RealmCreate): Promise<RealmEntity> {
    const realm = await super.create(data);

    // TODO: Create default applications for realm
    // TODO: Create default configurations for applications

    return realm;
  }

  protected buildCreateDataFromDto(
    dto: RealmDtoTypes['CreateRequestDto']
  ): RealmCreate {
    this.log.debug({ dto }, 'Building create data');
    return {
      name: dto.name,
      description: dto.description,
      dbName: dto.dbName,
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
