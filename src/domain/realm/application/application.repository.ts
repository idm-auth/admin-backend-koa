import { AbstractCrudMongoRepository } from 'koa-inversify-framework/abstract';
import { Repository } from 'koa-inversify-framework/stereotype';
import { ApplicationSchema, applicationSchema } from '@/domain/realm/application/application.entity';

export const ApplicationRepositorySymbol = Symbol.for('ApplicationRepository');

@Repository(ApplicationRepositorySymbol, { multiTenant: true })
export class ApplicationRepository extends AbstractCrudMongoRepository<ApplicationSchema> {
  constructor() {
    super(applicationSchema, 'applications');
  }
}
