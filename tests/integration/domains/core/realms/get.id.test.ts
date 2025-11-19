import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import * as realmService from '@/domains/core/realms/realm.service';
import { Realm } from '@/domains/core/realms/realm.model';
import {
  RealmBaseResponse,
  RealmPaginatedResponse,
} from '@/domains/core/realms/realm.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

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

    const realm: Realm = await realmService.create(realmData);
    createdRealmId = realm._id;
  });

  it('should find realm by valid ID', async () => {
    const response = await request(getApp().callback())
      .get(`/api/core/realms/${createdRealmId}`)
      .expect(200);

    const realmResponse: RealmBaseResponse = response.body;

    expect(realmResponse).toHaveProperty('_id', createdRealmId);
    expect(realmResponse).toHaveProperty('name', 'test-realm-findbyid');
    expect(realmResponse).toHaveProperty(
      'description',
      'Test realm for findById'
    );
    expect(realmResponse).toHaveProperty('dbName', 'test-db-findbyid');
    expect(realmResponse).toHaveProperty('publicUUID');
    expect(realmResponse).toHaveProperty('jwtConfig');
    expect(realmResponse.jwtConfig).toHaveProperty('secret');
    expect(typeof realmResponse.jwtConfig.secret).toBe('string');
    expect(realmResponse.jwtConfig).toHaveProperty('expiresIn', '12h');
  });

  it('should return 404 for non-existent ID', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .get(`/api/core/realms/${nonExistentId}`)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for invalid ID format', async () => {
    const invalidId = 'invalid-id-format';

    const response = await request(getApp().callback())
      .get(`/api/core/realms/${invalidId}`)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });

  it('should return 200 for empty ID (falls back to paginated list)', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/realms/')
      .expect(200);

    // This route falls back to paginated list when no ID is provided
    const paginatedResponse: RealmPaginatedResponse = response.body;
    expect(paginatedResponse).toHaveProperty('data');
    expect(paginatedResponse).toHaveProperty('pagination');
  });
});
