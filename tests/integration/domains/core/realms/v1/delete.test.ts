import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';

describe('DELETE /api/core/v1/realms/:id', () => {
  let createdRealmId: string;
  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    const realmData = {
      name: 'test-realm-delete',
      description: 'Test realm for deletion',
      dbName: 'test-db-delete',
      jwtConfig: {
        secret: 'test-secret-delete',
        expiresIn: '24h',
      },
    };

    const response = await request(getApp().callback())
      .post('/api/core/v1/realms')
      .send(realmData);

    if (response.status === 201) {
      createdRealmId = response.body._id;
    }
  });

  it('should delete realm successfully', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/core/v1/realms/${createdRealmId}`)
      .expect(204);

    expect(response.body).toEqual({});
  });

  it('should return 404 when trying to find deleted realm', async () => {
    const response = await request(getApp().callback())
      .get(`/api/core/v1/realms/${createdRealmId}`)
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 404 for non-existent ID', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .delete(`/api/core/v1/realms/${nonExistentId}`)
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for invalid ID format', async () => {
    const invalidId = 'invalid-id-format';

    const response = await request(getApp().callback())
      .delete(`/api/core/v1/realms/${invalidId}`)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation failed');
    expect(response.body.details).toContain('Invalid ID');
  });

  it('should return 404 when trying to delete already deleted realm', async () => {
    // Create a new realm for this test
    const realmData = {
      name: 'test-realm-double-delete',
      description: 'Test realm for double deletion',
      dbName: 'test-db-double-delete',
    };

    const createResponse = await request(getApp().callback())
      .post('/api/core/v1/realms')
      .send(realmData);

    const realmId = createResponse.body._id;

    // Delete it first time
    await request(getApp().callback())
      .delete(`/api/core/v1/realms/${realmId}`)
      .expect(204);

    // Try to delete it again
    const response = await request(getApp().callback())
      .delete(`/api/core/v1/realms/${realmId}`)
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });
});