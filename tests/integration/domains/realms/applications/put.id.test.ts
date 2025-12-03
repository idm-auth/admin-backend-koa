import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { getAuthToken } from '@test/utils/auth.util';
import { v4 as uuidv4 } from 'uuid';
import * as applicationService from '@/domains/realms/applications/application.service';
import { ApplicationBaseResponse } from '@/domains/realms/applications/application.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('PUT /api/realm/:tenantId/applications/:id', () => {
  let tenantId: string;
  let createdApplicationId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-application-put');
    authToken = await getAuthToken(tenantId, 'applications.put.id.test');

    const application = await applicationService.create(tenantId, {
      name: 'Original Name',
    });
    createdApplicationId = application._id;
  });

  it('should update application successfully', async () => {
    const updateData = {
      name: 'Updated Name',
    };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/applications/${createdApplicationId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData)
      .expect(200);

    const applicationResponse: ApplicationBaseResponse = response.body;
    expect(applicationResponse).toHaveProperty('_id', createdApplicationId);
    expect(applicationResponse).toHaveProperty('name', 'Updated Name');
  });

  it('should update application with empty data', async () => {
    const updateData = {};

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/applications/${createdApplicationId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData)
      .expect(200);

    const applicationResponse: ApplicationBaseResponse = response.body;
    expect(applicationResponse).toHaveProperty('_id', createdApplicationId);
  });

  it('should return 404 for non-existent application', async () => {
    const nonExistentId = uuidv4();
    const updateData = { name: 'Updated' };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/applications/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Application not found');
  });

  it('should return 400 for invalid application id format', async () => {
    const invalidId = 'invalid-id';
    const updateData = { name: 'Updated' };

    const response = await request(getApp().callback())
      .put(`/api/realm/${tenantId}/applications/${invalidId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });
});
