import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import * as realmService from '@/domains/core/realms/realm.service';
import { Realm } from '@/domains/core/realms/realm.model';
import { RealmReadResponse } from '@/domains/core/realms/realm.schema';
import { ErrorResponse } from '@/domains/commons/base/base.schema';

describe('GET /api/core/realms/publicUUID/:publicUUID', () => {
  let createdRealmPublicUUID: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    // Criar um realm para os testes usando service
    const realmData = {
      name: 'test-realm-publicuuid',
      description: 'Test realm for publicUUID endpoint',
      dbName: 'test-db-publicuuid',
      jwtConfig: {
        secret: 'test-secret-publicuuid',
        expiresIn: '24h',
      },
    };

    const realm: Realm = await realmService.create(realmData);
    createdRealmPublicUUID = realm.publicUUID;
    if (!createdRealmPublicUUID) {
      throw new Error('Realm created but no publicUUID returned');
    }
  });

  it('should get realm by publicUUID successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/core/realms/publicUUID/${createdRealmPublicUUID}`)
      .expect(200);

    const realmResponse: RealmReadResponse = response.body;

    expect(realmResponse).toHaveProperty('_id');
    expect(realmResponse).toHaveProperty('name', 'test-realm-publicuuid');
    expect(realmResponse).toHaveProperty(
      'description',
      'Test realm for publicUUID endpoint'
    );
    expect(realmResponse).toHaveProperty('dbName', 'test-db-publicuuid');
    expect(realmResponse).toHaveProperty('publicUUID', createdRealmPublicUUID);
    expect(realmResponse).toHaveProperty('jwtConfig');
    expect(realmResponse.jwtConfig).toHaveProperty('secret');
    expect(realmResponse.jwtConfig).toHaveProperty('expiresIn', '24h');
  });

  it('should return 404 for non-existent publicUUID', async () => {
    const nonExistentPublicUUID = 'fada3615-77e9-4f12-adc7-89bc274cb719';

    const response = await request(getApp().callback())
      .get(`/api/core/realms/publicUUID/${nonExistentPublicUUID}`)
      .expect(404);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Realm not found');
  });

  it('should return 400 for invalid publicUUID format', async () => {
    const invalidPublicUUID = 'invalid-uuid';

    const response = await request(getApp().callback())
      .get(`/api/core/realms/publicUUID/${invalidPublicUUID}`)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Invalid ID');
  });
});
