import { Container } from 'inversify';
import { RealmModule } from '@/domain/core/realm/realm.module';
import { CoreApplicationConfigurationModule } from '@/domain/core/application-configuration/application-configuration.module';

/**
 * Initialize Core Modules - Phase 1
 * 
 * Modules that don't depend on realm modules.
 * Must be initialized before realm modules.
 */
export async function initCoreModulesPhase1(container: Container): Promise<void> {
  new RealmModule(container);
}

/**
 * Initialize Core Modules - Phase 2
 * 
 * Modules that depend on realm modules.
 * Must be initialized after realm modules.
 */
export async function initCoreModulesPhase2(container: Container): Promise<void> {
  new CoreApplicationConfigurationModule(container);
}
