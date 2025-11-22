import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import * as realmService from '@/domains/core/realms/realm.service';
import { Realm } from '@/domains/core/realms/realm.model';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('DELETE /api/core/realms/:id', () => {
  let createdRealmId: string;
  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    const realmData = {
      name: 'test-realm-delete',
      description: 'Test realm for deletion',
      dbName: 'vi-test-db-delete',
      jwtConfig: {
        secret: 'test-secret-delete',
        expiresIn: '24h',
      },
    };

    const realm: Realm = await realmService.create(realmData);
    createdRealmId = realm._id;
  });

  it('should delete realm successfully', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/core/realms/${createdRealmId}`)
      .expect(204);

    expect(response.body).toEqual({});
  });

  it('should return 404 when trying to find deleted realm', async () => {
    const response = await request(getApp().callback())
      .get(`/api/core/realms/${createdRealmId}`)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 404 for non-existent ID', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .delete(`/api/core/realms/${nonExistentId}`)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for invalid ID format', async () => {
    const invalidId = 'invalid-id-format';

    const response = await request(getApp().callback())
      .delete(`/api/core/realms/${invalidId}`)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });

  it('should return 404 when trying to delete already deleted realm', async () => {
    // Create a new realm for this test using service
    const realmData = {
      name: 'test-realm-double-delete',
      description: 'Test realm for double deletion',
      dbName: 'vi-test-db-double-delete',
    };

    const realm: Realm = await realmService.create(realmData);
    const realmId = realm._id;

    // Delete it first time
    await request(getApp().callback())
      .delete(`/api/core/realms/${realmId}`)
      .expect(204);

    // Try to delete it again
    const response = await request(getApp().callback())
      .delete(`/api/core/realms/${realmId}`)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });
});
