import { ApplicationBaseResponse } from '@/domains/realms/applications/application.schema';
import { getAuthToken } from '@test/utils/auth.util';
import { getTenantId } from '@test/utils/tenant.util';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

describe('POST /api/realm/:tenantId/applications', () => {
  let tenantId: string;
  let authToken: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-application-post');
    authToken = await getAuthToken(tenantId, 'applications.post.test');
  });

  it('should create a new application successfully', async () => {
    const applicationData = {
      name: 'Test Application',
      systemId: 'test-system',
      availableActions: [
        {
          resourceType: 'accounts',
          pathPattern: '/accounts/:accountId',
          operations: ['create', 'read', 'update', 'delete'],
        },
      ],
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/applications`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(applicationData)
      .expect(201);

    const application: ApplicationBaseResponse = response.body;

    expect(application).toHaveProperty('_id');
    expect(application).toHaveProperty('name', 'Test Application');
    expect(application).toHaveProperty('systemId', 'test-system');
    expect(application).toHaveProperty('applicationSecret');
    expect(application).toHaveProperty('availableActions');
    expect(application.availableActions).toHaveLength(1);
  });

  it('should return 400 for missing required fields', async () => {
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/applications`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});
