import { AbstractCrudMongoRepository } from '@idm-auth/koa-inversify-framework/abstract';
import { Repository } from '@idm-auth/koa-inversify-framework/stereotype';
import {
  ApplicationConfigurationEntity,
  ApplicationConfigurationSchema,
  applicationConfigurationSchema,
} from '@/domain/realm/application-configuration/application-configuration.entity';

export const ApplicationConfigurationRepositorySymbol = Symbol.for(
  'ApplicationConfigurationRepository'
);

@Repository(ApplicationConfigurationRepositorySymbol, { multiTenant: true })
export class ApplicationConfigurationRepository extends AbstractCrudMongoRepository<ApplicationConfigurationSchema> {
  constructor() {
    super(applicationConfigurationSchema, 'application-configuration');
  }

  async findByApplicationAndEnvironment(
    applicationId: string,
    environment: string
  ): Promise<ApplicationConfigurationEntity> {
    return this.findOne({ applicationId, environment });
  }
}
