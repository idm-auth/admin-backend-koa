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

export async function initRealmModules(container: Container): Promise<void> {
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
  new ApplicationModule(container);
}
