import { withSpan } from '@/utils/tracing.util';
import { ApplicationRegistry } from './application-registry.model';
import {
  ApplicationRegistryCreateResponse,
  ApplicationRegistryUpdateResponse,
  ApplicationRegistryListItemResponse,
} from './application-registry.schema';

const MAPPER_NAME = 'application-registry';

export const toCreateResponse = (
  registry: ApplicationRegistry
): ApplicationRegistryCreateResponse => {
  return withSpan(
    {
      name: `${MAPPER_NAME}.mapper.toCreateResponse`,
      attributes: { 'application-registry.id': registry._id.toString() },
    },
    () => ({
      _id: registry._id.toString(),
      applicationKey: registry.applicationKey,
      tenantId: registry.tenantId,
      applicationId: registry.applicationId,
    })
  );
};

export const toUpdateResponse = (
  registry: ApplicationRegistry
): ApplicationRegistryUpdateResponse => {
  return withSpan(
    {
      name: `${MAPPER_NAME}.mapper.toUpdateResponse`,
      attributes: { 'application-registry.id': registry._id.toString() },
    },
    () => ({
      _id: registry._id.toString(),
      applicationKey: registry.applicationKey,
      tenantId: registry.tenantId,
      applicationId: registry.applicationId,
    })
  );
};

export const toListItemResponse = (
  registry: ApplicationRegistry
): ApplicationRegistryListItemResponse => {
  return withSpan(
    {
      name: `${MAPPER_NAME}.mapper.toListItemResponse`,
      attributes: { 'application-registry.id': registry._id.toString() },
    },
    () => ({
      _id: registry._id.toString(),
      applicationKey: registry.applicationKey,
      tenantId: registry.tenantId,
      applicationId: registry.applicationId,
    })
  );
};
