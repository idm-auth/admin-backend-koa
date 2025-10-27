import request from 'supertest';
import { describe, expect, it } from 'vitest';

describe('POST /api/core/v1/realms', () => {
  const getApp = () => globalThis.testKoaApp;

  it('should create a new realm successfully', async () => {
    const realmData = {
      name: 'test-realm-create',
      description: 'Test realm for creation',
      dbName: 'test-db-create',
      jwtConfig: {
        secret: 'test-secret-key',
        expiresIn: '24h',
      },
    };

    const response = await request(getApp().callback())
      .post('/api/core/v1/realms')
      .send(realmData)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('publicUUID');
    expect(response.body.name).toBe(realmData.name);
    expect(response.body.description).toBe(realmData.description);
    expect(response.body.dbName).toBe(realmData.dbName);
    expect(response.body.jwtConfig).toHaveProperty('secret');
    expect(typeof response.body.jwtConfig.secret).toBe('string');
    expect(response.body.jwtConfig.expiresIn).toBe(
      realmData.jwtConfig.expiresIn
    );
  });

  it('should return 400 for missing name', async () => {
    const realmData = {
      description: 'Test realm',
      dbName: 'test-db',
    };

    const response = await request(getApp().callback())
      .post('/api/core/v1/realms')
      .send(realmData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Name is required');
  });

  it('should return 400 for missing dbName', async () => {
    const realmData = {
      name: 'test-realm',
      description: 'Test realm',
    };

    const response = await request(getApp().callback())
      .post('/api/core/v1/realms')
      .send(realmData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Database name is required');
  });

  it('should create realm successfully without jwtConfig', async () => {
    const realmData = {
      name: 'test-realm-no-jwt',
      description: 'Test realm without JWT config',
      dbName: 'test-db-no-jwt',
    };

    const response = await request(getApp().callback())
      .post('/api/core/v1/realms')
      .send(realmData)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('name', realmData.name);
    expect(response.body).toHaveProperty('dbName', realmData.dbName);
    expect(response.body).toHaveProperty('publicUUID');
  });

  it('should return 409 for duplicate name (Conflict)', async () => {
    const app = getApp();
    const realmData = {
      name: 'duplicate-test-realm',
      description: 'First realm',
      dbName: 'first-db',
    };

    // Create first realm
    const firstResponse = await request(app.callback())
      .post('/api/core/v1/realms')
      .send(realmData)
      .expect(201);

    expect(firstResponse.body).toHaveProperty('_id');
    expect(firstResponse.body.name).toBe(realmData.name);

    // Try to create second realm with same name using the same app instance
    const duplicateData = {
      name: 'duplicate-test-realm', // Same name
      description: 'Second realm',
      dbName: 'second-db',
    };

    const response = await request(app.callback())
      .post('/api/core/v1/realms')
      .send(duplicateData)
      .expect(409); // 409 Conflict for duplicate resource

    expect(response.body).toHaveProperty('error', 'Resource already exists');
    expect(response.body).toHaveProperty('field', 'name');
    expect(response.body).toHaveProperty(
      'details',
      'A resource with this name already exists'
    );
  });
});
