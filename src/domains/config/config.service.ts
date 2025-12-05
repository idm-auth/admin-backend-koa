import {
  EnvConfig,
  envConfigZSchema,
  WebAdminConfigResponse,
  webAdminConfigZSchema,
} from '@/domains/commons/base/webAdminConfig.schema';
import * as realmService from '@/domains/core/realms/realm.service';
import * as accountService from '@/domains/realms/accounts/account.service';
import * as applicationService from '@/domains/realms/applications/application.service';
import * as roleService from '@/domains/realms/roles/role.service';
import * as groupService from '@/domains/realms/groups/group.service';
import * as accountGroupService from '@/domains/realms/account-groups/account-group.service';
import * as groupRoleService from '@/domains/realms/group-roles/group-role.service';
import { NotFoundError } from '@/errors/not-found';
import { EnvKey, getEnvValue } from '@/plugins/dotenv.plugin';
import { getLogger } from '@/utils/localStorage.util';
import { InitSetup } from './config.schema';
import { getModel, WebAdminConfig } from './webAdminConfig.model';
import { ApplicationCreate } from '@/domains/realms/applications/application.schema';
import { PublicUUID } from '@/domains/commons/base/base.schema';

const CRUD_OPERATIONS = ['create', 'read', 'update', 'delete', 'list'] as const;

const IAM_SYSTEM_APPLICATION: ApplicationCreate = {
  name: 'IAM System',
  systemId: 'iam-system',
  availableActions: [
    {
      resourceType: 'realm.account',
      pathPattern: '/realm/:tenantId/accounts',
      operations: [...CRUD_OPERATIONS],
    },
    {
      resourceType: 'realm.role',
      pathPattern: '/realm/:tenantId/roles',
      operations: [...CRUD_OPERATIONS],
    },
    {
      resourceType: 'realm.policy',
      pathPattern: '/realm/:tenantId/policies',
      operations: [...CRUD_OPERATIONS],
    },
    {
      resourceType: 'realm.group',
      pathPattern: '/realm/:tenantId/groups',
      operations: [...CRUD_OPERATIONS],
    },
  ],
};

export const getWebAdminConfig = async (args: {
  app: string;
  env: EnvConfig;
}): Promise<WebAdminConfigResponse> => {
  const logger = await getLogger();

  logger.debug({
    app: args.app,
    env: args.env,
  });

  const doc = await getModel().findOne({
    app: args.app,
    env: args.env,
  });
  logger.info({
    msg: `model: ${JSON.stringify(doc)}`,
  });

  if (!doc) throw new NotFoundError('Web admin config not found');
  const result = webAdminConfigZSchema.parse(doc);

  return result;
};

/**
 * Repair Default Setup
 *
 * Checks and recreates default data if missing:
 * - IAM System application
 * - iam-admin role
 * - iam-admin group
 * - group-role association
 *
 * Does NOT touch admin accounts - only system resources.
 * If tenantId is not provided, uses core realm.
 */
export const repairDefaultSetup = async (tenantId?: PublicUUID) => {
  const logger = await getLogger();

  if (!tenantId) {
    const coreRealm = await realmService.getRealmCore();
    tenantId = coreRealm.publicUUID;
    logger.info({ tenantId }, 'Using core realm tenantId');
  }

  // Check and create iam-system application
  let iamSystemApp;
  try {
    iamSystemApp = await applicationService.findOneByQuery(tenantId, {
      systemId: 'iam-system',
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      iamSystemApp = await applicationService.create(
        tenantId,
        IAM_SYSTEM_APPLICATION
      );
      logger.info(
        { applicationId: iamSystemApp._id },
        'IAM System application recreated'
      );
    } else {
      throw error;
    }
  }

  // Check and create iam-admin role
  let iamAdminRole;
  try {
    iamAdminRole = await roleService.findOneByQuery(tenantId, {
      name: 'iam-admin',
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      iamAdminRole = await roleService.create(tenantId, {
        name: 'iam-admin',
        description:
          'IAM System Administrator - Full access to all IAM resources',
      });
      logger.info({ roleId: iamAdminRole._id }, 'IAM Admin role recreated');
    } else {
      throw error;
    }
  }

  // Check and create iam-admin group
  let iamAdminGroup;
  try {
    iamAdminGroup = await groupService.findOneByQuery(tenantId, {
      name: 'iam-admin',
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      iamAdminGroup = await groupService.create(tenantId, {
        name: 'iam-admin',
        description: 'IAM System Administrators group',
      });
      logger.info({ groupId: iamAdminGroup._id }, 'IAM Admin group recreated');
    } else {
      throw error;
    }
  }

  // Check and create group-role association
  const groupRoles = await groupRoleService.getGroupRoles(tenantId, {
    groupId: iamAdminGroup._id,
  });
  const hasRole = groupRoles.find((gr) => gr.roleId === iamAdminRole._id);
  if (!hasRole) {
    await groupRoleService.addRoleToGroup(tenantId, {
      groupId: iamAdminGroup._id,
      roleId: iamAdminRole._id,
    });
    logger.info(
      { groupId: iamAdminGroup._id, roleId: iamAdminRole._id },
      'IAM Admin group-role association recreated'
    );
  }

  logger.info({ tenantId }, 'Default setup repair completed');
  return { status: 200, tenantId };
};

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
 * - TODO: Default policies (permission definitions for iam-admin role)
 *
 * Idempotent - returns 200 if already exists.
 */
export const initSetup = async (data: InitSetup) => {
  const logger = await getLogger();
  const base = {
    app: 'web-admin',
    env: getEnvValue(EnvKey.NODE_ENV),
  };
  const doc = await getModel().findOne(base);
  if (!doc) {
    const realmCore = await realmService.initSetup();

    // Create initial admin account
    const adminAccount = await accountService.create(
      realmCore.publicUUID,
      data.adminAccount
    );
    logger.info(
      { accountId: adminAccount._id },
      'Initial admin account created'
    );

    // Create/repair default system resources
    await repairDefaultSetup(realmCore.publicUUID);

    // Get group to associate admin account (guaranteed to exist after repair)
    const iamAdminGroup = await groupService.findOneByQuery(
      realmCore.publicUUID,
      { name: 'iam-admin' }
    );

    // Associate admin account with iam-admin group
    await accountGroupService.create(realmCore.publicUUID, {
      accountId: adminAccount._id,
      groupId: iamAdminGroup._id,
    });
    logger.info(
      { accountId: adminAccount._id, groupId: iamAdminGroup._id },
      'Admin account associated with iam-admin group'
    );

    const config: WebAdminConfig = {
      app: base.app,
      env: envConfigZSchema.parse(base.env),
      api: {
        main: {
          url: getEnvValue(EnvKey.API_MAIN_URL),
        },
      },
      coreRealm: {
        publicUUID: realmCore.publicUUID,
      },
    };
    logger.debug(config);
    await getModel().create(config);

    return { status: 201 };
  } else {
    return { status: 200 };
  }
};
