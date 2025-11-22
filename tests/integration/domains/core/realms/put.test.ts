import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import * as realmService from '@/domains/core/realms/realm.service';
import { RealmUpdateResponse } from '@/domains/core/realms/realm.schema';
import {
  ErrorResponse,
  ConflictErrorResponse,
} from '@/domains/commons/base/base.schema';

describe('PUT /api/core/realms/:id', () => {
  let createdRealmId: string;
  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    const realmData = {
      name: 'test-realm-update',
      description: 'Test realm for update',
      dbName: 'vi-test-db-update',
      jwtConfig: {
        secret: 'original-secret',
        expiresIn: '24h',
      },
    };

    const realm = await realmService.create(realmData);
    createdRealmId = realm._id;
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
      .put(`/api/core/realms/${createdRealmId}`)
      .send(updateData)
      .expect(200);

    const realmResponse: RealmUpdateResponse = response.body;
    expect(realmResponse).toHaveProperty('_id', createdRealmId);
    expect(realmResponse.name).toBe(updateData.name);
    expect(realmResponse.description).toBe(updateData.description);
    expect(realmResponse.jwtConfig).toHaveProperty('secret');
    expect(typeof realmResponse.jwtConfig?.secret).toBe('string');
    expect(realmResponse.jwtConfig?.expiresIn).toBe(
      updateData.jwtConfig.expiresIn
    );
  });

  it('should update only provided fields', async () => {
    const partialUpdate = {
      description: 'Partially updated description',
    };

    const response = await request(getApp().callback())
      .put(`/api/core/realms/${createdRealmId}`)
      .send(partialUpdate)
      .expect(200);

    const realmResponse: RealmUpdateResponse = response.body;
    expect(realmResponse.description).toBe(partialUpdate.description);
    expect(realmResponse.name).toBe('updated-realm-name'); // Should remain from previous update
  });

  it('should return 404 for non-existent ID', async () => {
    const nonExistentId = uuidv4();
    const updateData = {
      name: 'updated-name',
    };

    const response = await request(getApp().callback())
      .put(`/api/core/realms/${nonExistentId}`)
      .send(updateData)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 400 for invalid ID format', async () => {
    const invalidId = 'invalid-id-format';
    const updateData = {
      name: 'updated-name',
    };

    const response = await request(getApp().callback())
      .put(`/api/core/realms/${invalidId}`)
      .send(updateData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });

  it('should return 409 for duplicate name (Conflict)', async () => {
    // Create another realm using service
    const anotherRealmData = {
      name: 'another-realm-for-duplicate-test',
      description: 'Another realm',
      dbName: 'vi-test-db-another',
    };

    await realmService.create(anotherRealmData);

    // Try to update first realm with the name of the second realm
    const updateData = {
      name: 'another-realm-for-duplicate-test',
    };

    const response = await request(getApp().callback())
      .put(`/api/core/realms/${createdRealmId}`)
      .send(updateData)
      .expect(409); // 409 Conflict for duplicate resource

    const conflictResponse: ConflictErrorResponse = response.body;
    expect(conflictResponse).toHaveProperty('error', 'Resource already exists');
    expect(conflictResponse).toHaveProperty('field', 'name');
    expect(conflictResponse).toHaveProperty(
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
      .put(`/api/core/realms/${createdRealmId}`)
      .send(jwtUpdate)
      .expect(200);

    const realmResponse: RealmUpdateResponse = response.body;
    expect(realmResponse.jwtConfig?.expiresIn).toBe('72h');
    expect(realmResponse.jwtConfig).toHaveProperty('secret'); // Should still exist
  });
});
