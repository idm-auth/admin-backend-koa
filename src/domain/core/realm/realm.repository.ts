import { AbstractCrudMongoRepository } from 'koa-inversify-framework/abstract';
import { Repository } from 'koa-inversify-framework/stereotype';
import {
  RealmSchema,
  realmSchema,
  RealmEntity,
} from '@/domain/core/realm/realm.entity';

export const RealmRepositorySymbol = Symbol.for('RealmRepository');

@Repository(RealmRepositorySymbol)
export class RealmRepository extends AbstractCrudMongoRepository<RealmSchema> {
  constructor() {
    super(realmSchema, 'realm');
  }

  async findByPublicUUID(publicUUID: string): Promise<RealmEntity> {
    return this.findOne({ publicUUID });
  }

  async findByName(name: string): Promise<RealmEntity> {
    return this.findOne({ name });
  }

  async dropDatabase(dbName: string): Promise<void> {
    await this.mongodb.dropDatabase(dbName);
  }
}
