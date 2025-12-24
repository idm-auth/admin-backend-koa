import { AbstractMongoRepository } from 'koa-inversify-framework/abstract';
import { Repository } from 'koa-inversify-framework/stereotype';
import { RealmSchema, realmSchema, RealmEntity } from '@/domain/core/realm/realm.entity';

export const RealmRepositorySymbol = Symbol.for('RealmRepository');

@Repository(RealmRepositorySymbol)
export class RealmRepository extends AbstractMongoRepository<RealmSchema> {
  constructor() {
    super(realmSchema, 'realm');
  }

  async findByPublicUUID(publicUUID: string): Promise<RealmEntity | null> {
    return this.findOne({ publicUUID });
  }

  async findByName(name: string): Promise<RealmEntity | null> {
    return this.findOne({ name });
  }
}
