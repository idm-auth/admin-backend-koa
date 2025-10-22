import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';

describe('GET /api/core/v1/realms/:id', () => {
  let createdRealmId: string;
  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    const realmData = {
      name: 'test-realm-findbyid',
      description: 'Test realm for findById',
      dbName: 'test-db-findbyid',
      jwtConfig: {
        secret: 'test-secret-findbyid',
        expiresIn: '12h',
      },
    };

    const response = await request(getApp().callback())
      .post('/api/core/v1/realms')
      .send(realmData);

    if (response.status === 201) {
      createdRealmId = response.body._id;
    }
  });

  it('should find realm by valid ID', async () => {
    const response = await request(getApp().callback())
      .get(`/api/core/v1/realms/${createdRealmId}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdRealmId);
    expect(response.body).toHaveProperty('name', 'test-realm-findbyid');
    expect(response.body).toHaveProperty('description', 'Test realm for findById');
    expect(response.body).toHaveProperty('dbName', 'test-db-findbyid');
    expect(response.body).toHaveProperty('publicUUID');
    expect(response.body).toHaveProperty('jwtConfig');
    expect(response.body.jwtConfig).toHaveProperty('secret', 'test-secret-findbyid');
    expect(response.body.jwtConfig).toHaveProperty('expiresIn', '12h');

  });

  it('should return 404 for non-existent ID', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .get(`/api/core/v1/realms/${nonExistentId}`)
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for invalid ID format', async () => {
    const invalidId = 'invalid-id-format';

    const response = await request(getApp().callback())
      .get(`/api/core/v1/realms/${invalidId}`)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation failed');
    expect(response.body.details).toContain('Invalid ID');
  });

  it('should return 200 for empty ID (falls back to paginated list)', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms/')
      .expect(200);

    // This route falls back to paginated list when no ID is provided
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('pagination');
  });
});