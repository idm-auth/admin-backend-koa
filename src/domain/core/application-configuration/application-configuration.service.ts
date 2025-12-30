import { AbstractService } from 'koa-inversify-framework/abstract';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { Service } from 'koa-inversify-framework/stereotype';

export const CoreApplicationConfigurationServiceSymbol = Symbol.for(
  'CoreApplicationConfigurationService'
);

@Service(CoreApplicationConfigurationServiceSymbol)
export class CoreApplicationConfigurationService extends AbstractService {

  /**
   * Repair Default Setup
   *
   * Checks and recreates default data if missing:
   * - IAM System application
   * - iam-admin role
   * - iam-admin group
   * - Default policies (iam-admin-full-access)
   * - role-policy associations
   * - group-role association
   *
   * Does NOT touch admin accounts - only system resources.
   */
  @TraceAsync('core-application-configuration.service.repairDefaultSetup')
  async repairDefaultSetup(
    tenantId: string
  ): Promise<{ status: number; tenantId: string }> {
    // TODO: Implement
    return { status: 200, tenantId };
    /*
    const IAM_SYSTEM_ID = 'iam-system';

    const applicationService = this.container.get(ApplicationServiceSymbol);
    const roleService = this.container.get(RoleServiceSymbol);
    const groupService = this.container.get(GroupServiceSymbol);
    const policyService = this.container.get(PolicyServiceSymbol);
    const rolePolicyService = this.container.get(RolePolicyServiceSymbol);
    const groupRoleService = this.container.get(GroupRoleServiceSymbol);

    // TODO: Generate availableActions from routes
    const generatedActions: string[] = [];
    this.log.info({ generatedActions }, 'Generated availableActions from routes');

    // Check and create/update iam-system application
    let iamSystemApp;
    try {
      iamSystemApp = await applicationService.findBySystemId(tenantId, IAM_SYSTEM_ID);
      iamSystemApp = await applicationService.update(tenantId, iamSystemApp.id, {
        availableActions: generatedActions,
      });
      this.log.info({ applicationId: iamSystemApp.id }, 'IAM System application availableActions updated');
    } catch (error) {
      if (error instanceof NotFoundError) {
        iamSystemApp = await applicationService.create(tenantId, {
          name: 'IAM System',
          systemId: IAM_SYSTEM_ID,
          availableActions: generatedActions,
        });
        this.log.info({ applicationId: iamSystemApp.id }, 'IAM System application created');
      } else {
        throw error;
      }
    }

    // Check and create iam-admin role
    let iamAdminRole;
    try {
      iamAdminRole = await roleService.findByName(tenantId, 'iam-admin');
    } catch (error) {
      if (error instanceof NotFoundError) {
        iamAdminRole = await roleService.create(tenantId, {
          name: 'iam-admin',
          description: 'IAM System Administrator - Full access to all IAM resources',
        });
        this.log.info({ roleId: iamAdminRole.id }, 'IAM Admin role recreated');
      } else {
        throw error;
      }
    }

    // Check and create iam-admin group
    let iamAdminGroup;
    try {
      iamAdminGroup = await groupService.findByName(tenantId, 'iam-admin');
    } catch (error) {
      if (error instanceof NotFoundError) {
        iamAdminGroup = await groupService.create(tenantId, {
          name: 'iam-admin',
          description: 'IAM System Administrators group',
        });
        this.log.info({ groupId: iamAdminGroup.id }, 'IAM Admin group recreated');
      } else {
        throw error;
      }
    }

    // Check and create iam-admin-full-access policy
    let iamAdminPolicy;
    try {
      iamAdminPolicy = await policyService.findByName(tenantId, 'iam-admin-full-access');
    } catch (error) {
      if (error instanceof NotFoundError) {
        iamAdminPolicy = await policyService.create(tenantId, {
          version: '2025-12-24',
          name: 'iam-admin-full-access',
          description: 'Full access to all IAM resources',
          effect: 'Allow',
          actions: ['iam-system:*:*'],
          resources: ['grn:global:iam-system:*:*:*'],
        });
        this.log.info({ policyId: iamAdminPolicy.id }, 'IAM Admin policy recreated');
      } else {
        throw error;
      }
    }

    // Check and create role-policy association
    const rolePolicies = await rolePolicyService.findByRoleId(tenantId, iamAdminRole.id);
    const hasPolicy = rolePolicies.find((rp: any) => rp.policyId === iamAdminPolicy.id);
    if (!hasPolicy) {
      await rolePolicyService.create(tenantId, {
        roleId: iamAdminRole.id,
        policyId: iamAdminPolicy.id,
      });
      this.log.info(
        { roleId: iamAdminRole.id, policyId: iamAdminPolicy.id },
        'IAM Admin role-policy association recreated'
      );
    }

    // Check and create group-role association
    const groupRoles = await groupRoleService.findByGroupId(tenantId, iamAdminGroup.id);
    const hasRole = groupRoles.find((gr: any) => gr.roleId === iamAdminRole.id);
    if (!hasRole) {
      await groupRoleService.create(tenantId, {
        groupId: iamAdminGroup.id,
        roleId: iamAdminRole.id,
      });
      this.log.info(
        { groupId: iamAdminGroup.id, roleId: iamAdminRole.id },
        'IAM Admin group-role association recreated'
      );
    }

    this.log.info({ tenantId }, 'Default setup repair completed');
    return { status: 200, tenantId };
    */
  }

  /**
   * Initial Setup - Database Seeding
   *
   * Called by frontend via /config/init-setup endpoint on first startup.
   *
   * Creates:
   * - Core realm
   * - Initial admin account (from request)
   * - Default system resources (via repairDefaultSetup)
   * - Admin account associated with iam-admin group
   * - Web admin configuration
   *
   * Idempotent - returns 200 if already exists.
   */
  @TraceAsync('core-application-configuration.service.initSetup')
  async initSetup(data: {
    adminAccount: { email: string; password: string };
  }): Promise<{ status: number }> {
    // TODO: Implement
    return { status: 200 };
    /*
    const accountService = this.container.get(AccountServiceSymbol);
    const groupService = this.container.get(GroupServiceSymbol);
    const accountGroupService = this.container.get(AccountGroupServiceSymbol);

    // TODO: Check if config already exists (idempotent)
    // For now, assume it doesn't exist

    const realmCore = await this.realmService.initSetup();

    // Create initial admin account
    const adminAccount = await accountService.create(realmCore.publicUUID, data.adminAccount);
    this.log.info({ accountId: adminAccount.id }, 'Initial admin account created');

    // Create/repair default system resources
    await this.repairDefaultSetup(realmCore.publicUUID);

    // Get group to associate admin account (guaranteed to exist after repair)
    const iamAdminGroup = await groupService.findByName(realmCore.publicUUID, 'iam-admin');

    // Associate admin account with iam-admin group
    await accountGroupService.create(realmCore.publicUUID, {
      accountId: adminAccount.id,
      groupId: iamAdminGroup.id,
    });
    this.log.info(
      { accountId: adminAccount.id, groupId: iamAdminGroup.id },
      'Admin account associated with iam-admin group'
    );

    // TODO: Save web admin configuration

    return { status: 201 };
    */
  }
}
