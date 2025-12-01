import { RolePolicyDocument, getModel } from './role-policy.model';
import { RolePolicyCreate } from './role-policy.schema';
import { getDBName } from '@/domains/core/realms/realm.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';
import { withSpanAsync } from '@/utils/tracing.util';

const SERVICE_NAME = 'role-policy.service';

export const create = async (
  tenantId: string,
  data: RolePolicyCreate
): Promise<RolePolicyDocument> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.create`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'create',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info(
        { tenantId, roleId: data.roleId, policyId: data.policyId },
        'Creating role-policy relationship'
      );

      const dbName = await getDBName({ publicUUID: tenantId });
      const rolePolicy = await getModel(dbName).create(data);

      span.setAttributes({ 'entity.id': rolePolicy._id });
      return rolePolicy;
    }
  );
};

export const remove = async (
  tenantId: string,
  roleId: string,
  policyId: string
): Promise<void> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.remove`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'remove',
      },
    },
    async () => {
      const logger = await getLogger();
      logger.info(
        { tenantId, roleId, policyId },
        'Removing policy from role'
      );

      const dbName = await getDBName({ publicUUID: tenantId });
      const result = await getModel(dbName).findOneAndDelete({
        roleId,
        policyId,
      });

      if (!result) {
        throw new NotFoundError('Role-Policy relationship not found');
      }
    }
  );
};

export const findByRoleId = async (
  tenantId: string,
  roleId: string
): Promise<RolePolicyDocument[]> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.findByRoleId`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'findByRoleId',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, roleId }, 'Finding policies for role');

      const dbName = await getDBName({ publicUUID: tenantId });
      const rolePolicies = await getModel(dbName).find({ roleId });

      span.setAttributes({ 'result.count': rolePolicies.length });
      return rolePolicies;
    }
  );
};

export const findByPolicyId = async (
  tenantId: string,
  policyId: string
): Promise<RolePolicyDocument[]> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.findByPolicyId`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'findByPolicyId',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, policyId }, 'Finding roles with policy');

      const dbName = await getDBName({ publicUUID: tenantId });
      const policyRoles = await getModel(dbName).find({ policyId });

      span.setAttributes({ 'result.count': policyRoles.length });
      return policyRoles;
    }
  );
};
