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
import {
  SystemSetupService,
  SystemSetupServiceSymbol,
} from '@/domain/realm/system-setup/system-setup.service';
import { inject, Container } from 'inversify';
import { AbstractEnv, EnvSymbol } from 'koa-inversify-framework';
import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { DocId, EnvKey } from 'koa-inversify-framework/common';
import {
  ContainerSymbol,
  ExecutionContextProvider,
  ExecutionContextSymbol,
} from 'koa-inversify-framework/infrastructure';
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
  @inject(ContainerSymbol) private container!: Container;
  @inject(ExecutionContextSymbol)
  private executionContext!: ExecutionContextProvider;

  async create(data: RealmCreate): Promise<RealmEntity> {
    const realm = await super.create(data);
    await this.executionContext.init(
      { tenantId: realm.publicUUID } as never,
      async () => {
        const systemSetupService = this.container.get<SystemSetupService>(
          SystemSetupServiceSymbol
        );
        await systemSetupService.repairSetup();
      }
    );
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

  /**
   * Garante que o realm core existe, criando se necessário.
   *
   * Por que isso existe:
   * - Resolve problema de "ovo e galinha" no initSetup
   * - RealmService não é multi-tenant, pode criar realm sem ExecutionContext
   * - Retorna publicUUID para setar no ExecutionContext
   *
   * Como funciona:
   * 1. Tenta buscar realm core pelo dbName do env
   * 2. Se não existir, cria o realm core
   * 3. Retorna publicUUID do realm
   *
   * @returns publicUUID do realm core
   */
  async ensureCoreRealmExists(): Promise<string> {
    const coreDbName = this.env.get(EnvKey.MONGODB_CORE_DBNAME);

    try {
      // Tenta buscar realm core existente
      const coreRealm = await this.getRealmCore();
      this.log.debug({ realmId: coreRealm._id }, 'Core realm already exists');
      return coreRealm.publicUUID;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      // Realm core não existe, cria agora
      this.log.info('Creating core realm');

      const coreRealmData: RealmCreate = {
        name: 'idm-auth-core-realm',
        description: 'IDM Auth - Core realm for system administration',
        dbName: coreDbName,
      };

      const coreRealm = await this.create(coreRealmData);
      this.log.info({ realmId: coreRealm._id }, 'Core realm created');
      return coreRealm.publicUUID;
    }
  }

  /**
   * Apaga realm e remove o banco de dados associado.
   *
   * Por que isso existe:
   * - Cleanup completo em testes (remove realm + banco)
   * - Evita bancos órfãos no MongoDB
   *
   * Como funciona:
   * 1. Busca realm para obter dbName
   * 2. Apaga realm do banco core
   * 3. Remove banco de dados da realm
   *
   * @param id ID da realm (_id)
   */
  async deleteRealmAndDB(id: DocId): Promise<void> {
    // Busca realm para obter dbName antes de apagar
    const realm = await this.findById(id);
    const dbName = realm.dbName;

    this.log.info({ realmId: id, dbName }, 'Deleting realm and database');

    // Apaga realm do banco core
    await this.delete(id);

    // Remove banco de dados da realm
    await this.repository.dropDatabase(dbName);

    this.log.info({ realmId: id, dbName }, 'Realm and database deleted');
  }
}
