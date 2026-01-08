import { Container } from 'inversify';
import { AccountModule } from '@/domain/realm/account/account.module';
import { RoleModule } from '@/domain/realm/role/role.module';
import { GroupModule } from '@/domain/realm/group/group.module';
import { PolicyModule } from '@/domain/realm/policy/policy.module';
import { AccountRoleModule } from '@/domain/realm/account-role/account-role.module';
import { AccountGroupModule } from '@/domain/realm/account-group/account-group.module';
import { AccountPolicyModule } from '@/domain/realm/account-policy/account-policy.module';
import { GroupRoleModule } from '@/domain/realm/group-role/group-role.module';
import { GroupPolicyModule } from '@/domain/realm/group-policy/group-policy.module';
import { RolePolicyModule } from '@/domain/realm/role-policy/role-policy.module';
import { ApplicationModule } from '@/domain/realm/application/application.module';
import { ApplicationConfigurationModule } from '@/domain/realm/application-configuration/application-configuration.module';
import { JwtModule } from '@/domain/realm/jwt/jwt.module';
import { AuthenticationModule } from '@/domain/realm/authentication/authentication.module';
import { SystemSetupModule } from './system-setup/system-setup.module';

/**
 * Initialize Realm Modules - Phase 1
 *
 * Modules that must be initialized first.
 */
export async function initRealmModulesPhase1(
  container: Container
): Promise<void> {
  new ApplicationModule(container);
  new SystemSetupModule(container);
}

/**
 * Initialize Realm Modules - Phase 2
 *
 * All other realm modules.
 */
export async function initRealmModulesPhase2(
  container: Container
): Promise<void> {
  new AccountModule(container);
  new RoleModule(container);
  new GroupModule(container);
  new PolicyModule(container);
  new AccountRoleModule(container);
  new AccountGroupModule(container);
  new AccountPolicyModule(container);
  new GroupRoleModule(container);
  new GroupPolicyModule(container);
  new RolePolicyModule(container);

  new ApplicationConfigurationModule(container);
  new JwtModule(container);
  new AuthenticationModule(container);
}
