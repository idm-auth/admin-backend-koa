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
import * as policyService from '@/domains/realms/policies/policy.service';
import * as accountGroupService from '@/domains/realms/account-groups/account-group.service';
import * as groupRoleService from '@/domains/realms/group-roles/group-role.service';
import * as rolePolicyService from '@/domains/realms/role-policies/role-policy.service';
import { NotFoundError } from '@/errors/not-found';
import { EnvKey, getEnvValue } from '@/plugins/dotenv.plugin';
import { getLogger } from '@/utils/localStorage.util';
import { InitSetup } from './config.schema';
import { getModel, WebAdminConfig } from './webAdminConfig.model';
import { PublicUUID } from '@/domains/commons/base/base.schema';
import { IAM_SYSTEM_ID } from '@/domains/commons/base/constants';
import { getApiRouter } from '@/plugins/koaServer.plugin';
import { MagicRouter } from '@/utils/core/MagicRouter';

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
 * - Default policies (iam-admin-full-access)
 * - role-policy associations
 * - group-role association
 *
 * Does NOT touch admin accounts - only system resources.
 * If tenantId is not provided, uses core realm.
 */
export const repairDefaultSetup = async (tenantId: PublicUUID) => {
  const logger = await getLogger();

  // Generate availableActions from routes
  const generatedActions = generateAvailableActionsFromRoutes(IAM_SYSTEM_ID);
  logger.info(
    { generatedActions: JSON.stringify(generatedActions, null, 2) },
    'Generated availableActions from routes'
  );

  // Check and create/update iam-system application
  let iamSystemApp;
  try {
    iamSystemApp = await applicationService.findOneByQuery(tenantId, {
      systemId: IAM_SYSTEM_ID,
    });

    // Update availableActions if application exists
    iamSystemApp = await applicationService.update(tenantId, iamSystemApp._id, {
      availableActions: generatedActions,
    });
    logger.info(
      { applicationId: iamSystemApp._id },
      'IAM System application availableActions updated'
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      iamSystemApp = await applicationService.create(tenantId, {
        name: 'IAM System',
        systemId: IAM_SYSTEM_ID,
        availableActions: generatedActions,
      });
      logger.info(
        { applicationId: iamSystemApp._id },
        'IAM System application created'
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

  // Check and create iam-admin-full-access policy
  let iamAdminPolicy;
  try {
    iamAdminPolicy = await policyService.findOneByQuery(tenantId, {
      name: 'iam-admin-full-access',
    });
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
      logger.info(
        { policyId: iamAdminPolicy._id },
        'IAM Admin policy recreated'
      );
    } else {
      throw error;
    }
  }

  // Check and create role-policy association
  const rolePolicies = await rolePolicyService.findByRoleId(
    tenantId,
    iamAdminRole._id
  );
  const hasPolicy = rolePolicies.find(
    (rp) => rp.policyId === iamAdminPolicy._id
  );
  if (!hasPolicy) {
    await rolePolicyService.create(tenantId, {
      roleId: iamAdminRole._id,
      policyId: iamAdminPolicy._id,
    });
    logger.info(
      { roleId: iamAdminRole._id, policyId: iamAdminPolicy._id },
      'IAM Admin role-policy association recreated'
    );
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
 * Generate Available Actions from Routes
 *
 * Extracts availableActions from MagicRouter routes based on authorization config.
 * Groups routes by pathPattern and collects unique operations.
 *
 * @param systemId - Filter routes by systemId (e.g., 'iam-system')
 * @returns Array of availableActions for Application
 */
export const generateAvailableActionsFromRoutes = (systemId: string) => {
  const apiRouter = getApiRouter();

  // Collect all routes recursively from child routers with full path
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collectAllRoutes = (router: MagicRouter, parentPrefix = ''): any[] => {
    const basePath = (router as unknown as { basePath: string }).basePath || '';
    const fullPrefix = parentPrefix + basePath;

    const routes = router.getSwaggerRoutes ? router.getSwaggerRoutes() : [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routesWithFullPath = routes.map((route: any) => ({
      ...route,
      fullPath: fullPrefix + route.path,
    }));

    const childRouters =
      (
        router as unknown as {
          childRouters: Array<{ pathPrefix: string; router: MagicRouter }>;
        }
      ).childRouters || [];
    const childRoutes = childRouters.flatMap((child) =>
      collectAllRoutes(child.router, fullPrefix + child.pathPrefix)
    );

    return [...routesWithFullPath, ...childRoutes];
  };

  const allRoutes = collectAllRoutes(apiRouter);

  // Filter routes by systemId
  const systemRoutes = allRoutes.filter(
    (route) => route.authorization?.systemId === systemId
  );

  // Group by pathPattern and resource, collect operations
  const actionsMap = new Map<
    string,
    { resourceType: string; operations: Set<string> }
  >();
  systemRoutes.forEach((route) => {
    if (route.authorization) {
      const { resource, operation } = route.authorization;
      const pathPattern = route.fullPath;

      if (!actionsMap.has(pathPattern)) {
        actionsMap.set(pathPattern, {
          resourceType: resource,
          operations: new Set(),
        });
      }
      actionsMap.get(pathPattern)!.operations.add(operation);
    }
  });

  // Build availableActions array
  return Array.from(actionsMap.entries()).map(
    ([pathPattern, { resourceType, operations }]) => ({
      resourceType,
      pathPattern,
      operations: Array.from(operations),
    })
  );
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
