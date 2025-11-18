import { RoleDocument } from './role.model';
import { withSpan } from '@/utils/tracing.util';

const MAPPER_NAME = 'role.mapper';

export interface RoleResponse {
  _id: string;
  name: string;
  description?: string;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

export const toResponse = (role: RoleDocument): RoleResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toResponse`,
      attributes: {
        'entity.id': role._id.toString(),
        operation: 'toResponse',
      },
    },
    () => ({
      _id: role._id.toString(),
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
    })
  );

export const toListItemResponse = (role: RoleDocument): RoleResponse =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toListItemResponse`,
      attributes: {
        'entity.id': role._id.toString(),
        operation: 'toListItemResponse',
      },
    },
    () => ({
      _id: role._id.toString(),
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
    })
  );

export const toListResponse = (roles: RoleDocument[]): RoleResponse[] =>
  withSpan(
    {
      name: `${MAPPER_NAME}.toListResponse`,
      attributes: {
        'result.count': roles.length,
        operation: 'toListResponse',
      },
    },
    () => roles.map(toResponse)
  );
