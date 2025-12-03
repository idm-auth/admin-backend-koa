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
      applicationSecret: application.applicationSecret,
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
      applicationSecret: application.applicationSecret,
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
      applicationSecret: application.applicationSecret,
    })
  );
};
