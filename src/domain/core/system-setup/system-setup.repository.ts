import { AbstractCrudMongoRepository } from 'koa-inversify-framework/abstract';
import { Repository } from 'koa-inversify-framework/stereotype';
import { SystemSetupSchema, systemSetupSchema } from '@/domain/shared/system-setup/system-setup.entity';

export const SystemSetupCoreRepositorySymbol = Symbol.for('SystemSetupCoreRepository');

@Repository(SystemSetupCoreRepositorySymbol, { multiTenant: false })
export class SystemSetupRepository extends AbstractCrudMongoRepository<SystemSetupSchema> {
  constructor() {
    super(systemSetupSchema, 'system-setup');
  }
}
