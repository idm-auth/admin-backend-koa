import { withSpan } from '@/utils/tracing.util';
import { Application } from './application.model';
import {
  ApplicationCreateResponse,
  ApplicationListItemResponse,
  ApplicationUpdateResponse,
} from './application.schema';

const MAPPER_NAME = 'application';

export const toCreateResponse = (
  application: Application
): ApplicationCreateResponse => {
  return withSpan(
    {
      name: `${MAPPER_NAME}.mapper.toCreateResponse`,
      attributes: { 'application.id': application._id.toString() },
    },
    () => ({
      _id: application._id.toString(),
      name: application.name,
      systemId: application.systemId,
      availableActions: application.availableActions.map((action) => ({
        resourceType: action.resourceType,
        pathPattern: action.pathPattern,
        operations: action.operations,
      })),
      applicationSecret: application.applicationSecret,
      isActive: application.isActive,
    })
  );
};

export const toUpdateResponse = (
  application: Application
): ApplicationUpdateResponse => {
  return withSpan(
    {
      name: `${MAPPER_NAME}.mapper.toUpdateResponse`,
      attributes: { 'application.id': application._id.toString() },
    },
    () => ({
      _id: application._id.toString(),
      name: application.name,
      systemId: application.systemId,
      availableActions: application.availableActions.map((action) => ({
        resourceType: action.resourceType,
        pathPattern: action.pathPattern,
        operations: action.operations,
      })),
      applicationSecret: application.applicationSecret,
      isActive: application.isActive,
    })
  );
};

export const toListItemResponse = (
  application: Application
): ApplicationListItemResponse => {
  return withSpan(
    {
      name: `${MAPPER_NAME}.mapper.toListItemResponse`,
      attributes: { 'application.id': application._id.toString() },
    },
    () => ({
      _id: application._id.toString(),
      name: application.name,
      systemId: application.systemId,
      availableActions: application.availableActions.map((action) => ({
        resourceType: action.resourceType,
        pathPattern: action.pathPattern,
        operations: action.operations,
      })),
      applicationSecret: application.applicationSecret,
      isActive: application.isActive,
    })
  );
};
