import { withSpan } from '@/utils/tracing.util';
import { Group } from './group.model';
import {
  GroupCreateResponse,
  GroupListItemResponse,
  GroupUpdateResponse,
} from './group.schema';

const MAPPER_NAME = 'group';

export const toCreateResponse = (group: Group): GroupCreateResponse => {
  return withSpan(
    {
      name: `${MAPPER_NAME}.mapper.toCreateResponse`,
      attributes: { 'group.id': group._id.toString() },
    },
    () => ({
      _id: group._id.toString(),
      name: group.name,
      description: group.description,
    })
  );
};

export const toUpdateResponse = (group: Group): GroupUpdateResponse => {
  return withSpan(
    {
      name: `${MAPPER_NAME}.mapper.toUpdateResponse`,
      attributes: { 'group.id': group._id.toString() },
    },
    () => ({
      _id: group._id.toString(),
      name: group.name,
      description: group.description,
    })
  );
};

export const toListItemResponse = (group: Group): GroupListItemResponse => {
  return withSpan(
    {
      name: `${MAPPER_NAME}.mapper.toListItemResponse`,
      attributes: { 'group.id': group._id.toString() },
    },
    () => ({
      _id: group._id.toString(),
      name: group.name,
      description: group.description,
    })
  );
};