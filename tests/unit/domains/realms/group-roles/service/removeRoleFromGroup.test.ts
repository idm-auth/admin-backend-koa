import { describe, expect, it } from 'vitest';
import * as groupRoleService from '@/domains/realms/group-roles/group-role.service';
import { NotFoundError } from '@/errors/not-found';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('group-role.service.removeRoleFromGroup', () => {
  it('should throw NotFoundError when group-role relationship not found', async () => {
    const tenantId = await getTenantId('test-service-remove-not-found');
    const groupId = uuidv4();
    const roleId = uuidv4();

    await expect(
      groupRoleService.removeRoleFromGroup(tenantId, { groupId, roleId })
    ).rejects.toThrow(NotFoundError);
  });
});
