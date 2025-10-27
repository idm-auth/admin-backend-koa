import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';

describe('PUT /api/core/v1/realms/:id', () => {
  let createdRealmId: string;
  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    const realmData = {
      name: 'test-realm-update',
      description: 'Test realm for update',
      dbName: 'test-db-update',
      jwtConfig: {
        secret: 'original-secret',
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

  it('should update realm successfully', async () => {
    const updateData = {
      name: 'updated-realm-name',
      description: 'Updated description',
      jwtConfig: {
        secret: 'updated-secret',
        expiresIn: '48h',
      },
    };

    const response = await request(getApp().callback())
      .put(`/api/core/v1/realms/${createdRealmId}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdRealmId);
    expect(response.body.name).toBe(updateData.name);
    expect(response.body.description).toBe(updateData.description);
    expect(response.body.jwtConfig).toHaveProperty('secret');
    expect(typeof response.body.jwtConfig.secret).toBe('string');
    expect(response.body.jwtConfig.expiresIn).toBe(
      updateData.jwtConfig.expiresIn
    );
  });

  it('should update only provided fields', async () => {
    const partialUpdate = {
      description: 'Partially updated description',
    };

    const response = await request(getApp().callback())
      .put(`/api/core/v1/realms/${createdRealmId}`)
      .send(partialUpdate)
      .expect(200);

    expect(response.body.description).toBe(partialUpdate.description);
    expect(response.body.name).toBe('updated-realm-name'); // Should remain from previous update
  });

  it('should return 404 for non-existent ID', async () => {
    const nonExistentId = uuidv4();
    const updateData = {
      name: 'updated-name',
    };

    const response = await request(getApp().callback())
      .put(`/api/core/v1/realms/${nonExistentId}`)
      .send(updateData)
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for invalid ID format', async () => {
    const invalidId = 'invalid-id-format';
    const updateData = {
      name: 'updated-name',
    };

    const response = await request(getApp().callback())
      .put(`/api/core/v1/realms/${invalidId}`)
      .send(updateData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid ID');
  });

  it('should return 409 for duplicate name (Conflict)', async () => {
    // Create another realm
    const anotherRealmData = {
      name: 'another-realm-for-duplicate-test',
      description: 'Another realm',
      dbName: 'another-db',
    };

    // const anotherResponse =
    await request(getApp().callback())
      .post('/api/core/v1/realms')
      .send(anotherRealmData);

    // const anotherRealmId = anotherResponse.body._id;

    // Try to update first realm with the name of the second realm
    const updateData = {
      name: 'another-realm-for-duplicate-test',
    };

    const response = await request(getApp().callback())
      .put(`/api/core/v1/realms/${createdRealmId}`)
      .send(updateData)
      .expect(409); // 409 Conflict for duplicate resource

    expect(response.body).toHaveProperty('error', 'Resource already exists');
    expect(response.body).toHaveProperty('field', 'name');
    expect(response.body).toHaveProperty(
      'details',
      'A resource with this name already exists'
    );
  });

  it('should update jwtConfig partially', async () => {
    const jwtUpdate = {
      jwtConfig: {
        expiresIn: '72h',
      },
    };

    const response = await request(getApp().callback())
      .put(`/api/core/v1/realms/${createdRealmId}`)
      .send(jwtUpdate)
      .expect(200);

    expect(response.body.jwtConfig.expiresIn).toBe('72h');
    expect(response.body.jwtConfig).toHaveProperty('secret'); // Should still exist
  });
});
