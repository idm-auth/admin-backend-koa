import { DocId, PublicUUID } from '@/domains/commons/base/base.schema';
import { GroupPolicyDocument, getModel } from './group-policy.model';
import { GroupPolicyCreate } from './group-policy.schema';
import { getDBName } from '@/domains/core/realms/realm.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';
import { withSpanAsync } from '@/utils/tracing.util';

const SERVICE_NAME = 'group-policy.service';

export const create = async (
  tenantId: PublicUUID,
  data: GroupPolicyCreate
): Promise<GroupPolicyDocument> => {
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
        { tenantId, groupId: data.groupId, policyId: data.policyId },
        'Creating group-policy relationship'
      );

      const dbName = await getDBName({ publicUUID: tenantId });
      const groupPolicy = await getModel(dbName).create(data);

      span.setAttributes({ 'entity.id': groupPolicy._id });
      return groupPolicy;
    }
  );
};

export const remove = async (
  tenantId: PublicUUID,
  groupId: DocId,
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
        { tenantId, groupId, policyId },
        'Removing policy from group'
      );

      const dbName = await getDBName({ publicUUID: tenantId });
      const result = await getModel(dbName).findOneAndDelete({
        groupId,
        policyId,
      });

      if (!result) {
        throw new NotFoundError('Group-Policy relationship not found');
      }
    }
  );
};

export const findByGroupId = async (
  tenantId: PublicUUID,
  groupId: string
): Promise<GroupPolicyDocument[]> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.findByGroupId`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'findByGroupId',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, groupId }, 'Finding policies for group');

      const dbName = await getDBName({ publicUUID: tenantId });
      const groupPolicies = await getModel(dbName).find({ groupId });

      span.setAttributes({ 'result.count': groupPolicies.length });
      return groupPolicies;
    }
  );
};

export const findByPolicyId = async (
  tenantId: PublicUUID,
  policyId: string
): Promise<GroupPolicyDocument[]> => {
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
      logger.info({ tenantId, policyId }, 'Finding groups with policy');

      const dbName = await getDBName({ publicUUID: tenantId });
      const policyGroups = await getModel(dbName).find({ policyId });

      span.setAttributes({ 'result.count': policyGroups.length });
      return policyGroups;
    }
  );
};
