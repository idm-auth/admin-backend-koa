import {
  RealmService,
  RealmServiceSymbol,
} from '@/domain/core/realm/realm.service';
import { Container, inject } from 'inversify';
import { AbstractTenantResolver } from '@idm-auth/koa-inversify-framework';
import { ContainerSymbol } from '@idm-auth/koa-inversify-framework/infrastructure';
import { Configuration } from '@idm-auth/koa-inversify-framework/stereotype';

export const RealmTenantResolverSymbol = Symbol.for('RealmTenantResolver');

@Configuration(RealmTenantResolverSymbol)
export class RealmTenantResolver extends AbstractTenantResolver {
  @inject(ContainerSymbol)
  private container!: Container;

  async resolveTenantDbName(tenantId: string): Promise<string> {
    this.logger.debug({ tenantId }, 'Resolving tenant dbName');
    const realmService = this.container.get<RealmService>(RealmServiceSymbol);
    const realm = await realmService.findByPublicUUID(tenantId);
    this.logger.debug(
      { tenantId, dbName: realm.dbName },
      'Tenant resolution complete'
    );
    return realm.dbName;
  }

  async getTenantCorePublicUUID(): Promise<string> {
    this.logger.debug('Resolving core tenant publicUUID');
    const realmService = this.container.get<RealmService>(RealmServiceSymbol);
    const coreRealm = await realmService.getRealmCore();
    this.logger.debug(
      { publicUUID: coreRealm.publicUUID },
      'Core tenant resolved'
    );
    return coreRealm.publicUUID;
  }
}
