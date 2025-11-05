import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import * as realmService from '@/domains/core/realms/v1/realm.service';

describe('GET /api/core/v1/realms/publicUUID/:publicUUID', () => {
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

    const realm = await realmService.create(realmData);
    createdRealmPublicUUID = realm.publicUUID;
    if (!createdRealmPublicUUID) {
      throw new Error('Realm created but no publicUUID returned');
    }
  });

  it('should get realm by publicUUID successfully', async () => {
    const response = await request(getApp().callback())
      .get(`/api/core/v1/realms/publicUUID/${createdRealmPublicUUID}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('name', 'test-realm-publicuuid');
    expect(response.body).toHaveProperty(
      'description',
      'Test realm for publicUUID endpoint'
    );
    expect(response.body).toHaveProperty('dbName', 'test-db-publicuuid');
    expect(response.body).toHaveProperty('publicUUID', createdRealmPublicUUID);
    expect(response.body).toHaveProperty('jwtConfig');
    expect(response.body.jwtConfig).toHaveProperty('secret');
    expect(response.body.jwtConfig).toHaveProperty('expiresIn', '24h');
  });

  it('should return 404 for non-existent publicUUID', async () => {
    const nonExistentPublicUUID = 'fada3615-77e9-4f12-adc7-89bc274cb719';

    const response = await request(getApp().callback())
      .get(`/api/core/v1/realms/publicUUID/${nonExistentPublicUUID}`)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Realm not found');
  });

  it('should return 400 for invalid publicUUID format', async () => {
    const invalidPublicUUID = 'invalid-uuid';

    const response = await request(getApp().callback())
      .get(`/api/core/v1/realms/publicUUID/${invalidPublicUUID}`)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid ID');
  });
});
