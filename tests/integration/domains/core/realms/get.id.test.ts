import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import * as realmService from '@/domains/core/realms/realm.service';

describe('GET /api/core/realms/:id', () => {
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

    const realm = await realmService.create(realmData);
    createdRealmId = realm._id;
  });

  it('should find realm by valid ID', async () => {
    const response = await request(getApp().callback())
      .get(`/api/core/realms/${createdRealmId}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdRealmId);
    expect(response.body).toHaveProperty('name', 'test-realm-findbyid');
    expect(response.body).toHaveProperty(
      'description',
      'Test realm for findById'
    );
    expect(response.body).toHaveProperty('dbName', 'test-db-findbyid');
    expect(response.body).toHaveProperty('publicUUID');
    expect(response.body).toHaveProperty('jwtConfig');
    expect(response.body.jwtConfig).toHaveProperty('secret');
    expect(typeof response.body.jwtConfig.secret).toBe('string');
    expect(response.body.jwtConfig).toHaveProperty('expiresIn', '12h');
  });

  it('should return 404 for non-existent ID', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .get(`/api/core/realms/${nonExistentId}`)
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for invalid ID format', async () => {
    const invalidId = 'invalid-id-format';

    const response = await request(getApp().callback())
      .get(`/api/core/realms/${invalidId}`)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid ID');
  });

  it('should return 200 for empty ID (falls back to paginated list)', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/realms/')
      .expect(200);

    // This route falls back to paginated list when no ID is provided
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('pagination');
  });
});
