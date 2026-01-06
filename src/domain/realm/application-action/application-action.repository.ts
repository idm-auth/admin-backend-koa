import { AbstractCrudMongoRepository } from 'koa-inversify-framework/abstract';
import { Repository } from 'koa-inversify-framework/stereotype';
import { ApplicationActionSchema, applicationActionSchema } from '@/domain/realm/application-action/application-action.entity';

export const ApplicationActionRepositorySymbol = Symbol.for('ApplicationActionRepository');

@Repository(ApplicationActionRepositorySymbol, { multiTenant: true })
export class ApplicationActionRepository extends AbstractCrudMongoRepository<ApplicationActionSchema> {
  constructor() {
    super(applicationActionSchema, 'application-action');
  }
}
