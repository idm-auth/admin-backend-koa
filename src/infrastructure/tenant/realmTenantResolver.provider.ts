import { AbstractTenantResolver, ContainerSymbol } from 'koa-inversify-framework';
import { Configuration } from 'koa-inversify-framework/stereotype';
import { RealmService, RealmServiceSymbol } from '@/domain/core/realm/realm.service';
import { inject, Container } from 'inversify';

export const RealmTenantResolverSymbol = Symbol.for('RealmTenantResolver');

@Configuration(RealmTenantResolverSymbol)
export class RealmTenantResolver extends AbstractTenantResolver {
  @inject(ContainerSymbol)
  private container!: Container;

  async resolveTenantDbName(tenantId: string): Promise<string> {
    this.logger.debug({ tenantId }, 'Resolving tenant dbName');
    const realmService = this.container.get<RealmService>(RealmServiceSymbol);
    const realm = await realmService.findByPublicUUID(tenantId);
    this.logger.debug({ tenantId, dbName: realm.dbName }, 'Tenant resolution complete');
    return realm.dbName;
  }
}
