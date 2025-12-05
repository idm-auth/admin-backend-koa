import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { v4 as uuidv4 } from 'uuid';
import * as applicationService from '@/domains/realms/applications/application.service';
import {
  ErrorResponse,
  ValidationErrorResponse,
} from '@/domains/commons/base/base.schema';

describe('DELETE /api/realm/:tenantId/applications/:id', () => {
  let tenantId: string;
  let createdApplicationId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-application-delete');
    authToken = await getAuthToken(tenantId, 'applications.delete.id.test');

    const result = await applicationService.create(tenantId, {
      name: 'Test Application',
      systemId: 'test-system-delete',
      availableActions: [
        {
          resourceType: 'accounts',
          pathPattern: '/accounts/:accountId',
          operations: ['delete'],
        },
      ],
    });
    createdApplicationId = result._id.toString();
  });

  it('should delete application successfully', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/applications/${createdApplicationId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204);

    expect(response.body).toEqual({});
  });

  it('should return 404 for non-existent application', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/applications/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Application not found');
  });

  it('should return 400 for invalid application id format', async () => {
    const invalidId = 'invalid-id';

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/applications/${invalidId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(errorResponse.fields?.[0].message).toContain('Invalid ID');
  });
});
