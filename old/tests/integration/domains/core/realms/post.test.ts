import request from 'supertest';
import { describe, expect, it, beforeAll } from 'vitest';
import * as realmService from '@/domains/core/realms/realm.service';
import { getModel } from '@/domains/core/realms/realm.model';
import { RealmCreateResponse } from '@/domains/core/realms/realm.schema';
import {
  ErrorResponse,
  ConflictErrorResponse,
  ValidationErrorResponse,
} from '@/domains/commons/base/base.schema';

describe('POST /api/core/realms', () => {
  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    // Garantir que os índices estão criados
    await getModel().createIndexes();
  });

  it('should create a new realm successfully', async () => {
    const realmData = {
      name: 'test-realm-create',
      description: 'Test realm for creation',
      dbName: 'vi-test-db-create',
      jwtConfig: {
        expiresIn: '24h',
      },
    };

    const response = await request(getApp().callback())
      .post('/api/core/realms')
      .send(realmData)
      .expect(201);

    const realmResponse: RealmCreateResponse = response.body;
    expect(realmResponse).toHaveProperty('_id');
    expect(realmResponse).toHaveProperty('publicUUID');
    expect(realmResponse.name).toBe(realmData.name);
    expect(realmResponse.description).toBe(realmData.description);
    expect(realmResponse.dbName).toBe(realmData.dbName);
    expect(realmResponse.jwtConfig).toHaveProperty('secret');
    expect(typeof realmResponse.jwtConfig?.secret).toBe('string');
    expect(realmResponse.jwtConfig?.expiresIn).toBe(
      realmData.jwtConfig.expiresIn
    );
  });

  it('should create a new realm successfully with default jwtConfig', async () => {
    const realmData = {
      name: 'test-realm-create-default',
      description: 'Test realm for creation with defaults',
      dbName: 'vi-test-db-create-default',
    };

    const response = await request(getApp().callback())
      .post('/api/core/realms')
      .send(realmData)
      .expect(201);

    const realmResponse: RealmCreateResponse = response.body;
    expect(realmResponse).toHaveProperty('_id');
    expect(realmResponse).toHaveProperty('publicUUID');
    expect(realmResponse.name).toBe(realmData.name);
    expect(realmResponse.description).toBe(realmData.description);
    expect(realmResponse.dbName).toBe(realmData.dbName);
    expect(realmResponse.jwtConfig).toHaveProperty('secret');
    expect(typeof realmResponse.jwtConfig?.secret).toBe('string');
    expect(realmResponse.jwtConfig).toHaveProperty('expiresIn');
  });

  it('should return 400 for missing name', async () => {
    const realmData = {
      description: 'Test realm',
      dbName: 'test-db',
    };

    const response = await request(getApp().callback())
      .post('/api/core/realms')
      .send(realmData)
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(errorResponse.fields).toBeDefined();
    expect(
      errorResponse.fields?.some((f) => f.message.includes('Name is required'))
    ).toBe(true);
  });

  it('should return 400 for missing dbName', async () => {
    const realmData = {
      name: 'test-realm',
      description: 'Test realm',
    };

    const response = await request(getApp().callback())
      .post('/api/core/realms')
      .send(realmData)
      .expect(400);

    const errorResponse: ValidationErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error', 'Validation failed');
    expect(errorResponse.fields).toBeDefined();
    expect(
      errorResponse.fields?.some((f) =>
        f.message.includes('Database name is required')
      )
    ).toBe(true);
  });

  it('should create realm successfully without jwtConfig', async () => {
    const realmData = {
      name: 'test-realm-no-jwt',
      description: 'Test realm without JWT config',
      dbName: 'vi-test-db-no-jwt',
    };

    const response = await request(getApp().callback())
      .post('/api/core/realms')
      .send(realmData)
      .expect(201);

    const realmResponse: RealmCreateResponse = response.body;
    expect(realmResponse).toHaveProperty('_id');
    expect(realmResponse).toHaveProperty('name', realmData.name);
    expect(realmResponse).toHaveProperty('dbName', realmData.dbName);
    expect(realmResponse).toHaveProperty('publicUUID');
  });

  it('should return 400 for invalid jwtConfig.expiresIn format', async () => {
    const realmData = {
      name: 'test-realm-invalid-jwt',
      description: 'Test realm',
      dbName: 'vi-test-db-invalid-jwt',
      jwtConfig: {
        expiresIn: 'invalid-format',
      },
    };

    const response = await request(getApp().callback())
      .post('/api/core/realms')
      .send(realmData)
      .expect(400);

    const errorResponse: ErrorResponse = response.body;
    expect(errorResponse).toHaveProperty('error');
  });

  it('should return 409 for duplicate name (Conflict)', async () => {
    const realmData = {
      name: 'duplicate-test-realm',
      description: 'First realm',
      dbName: 'vi-test-db-first',
    };

    // Create first realm using service (pré-configuração)
    const firstRealm = await realmService.create(realmData);

    expect(firstRealm).toHaveProperty('_id');
    expect(firstRealm.name).toBe(realmData.name);

    // Try to create second realm with same name via API
    const duplicateData = {
      name: 'duplicate-test-realm', // Same name
      description: 'Second realm',
      dbName: 'vi-test-db-second',
    };

    const response = await request(getApp().callback())
      .post('/api/core/realms')
      .send(duplicateData)
      .expect(409);

    const conflictResponse: ConflictErrorResponse = response.body;
    expect(conflictResponse).toHaveProperty('error', 'Resource already exists');
    expect(conflictResponse).toHaveProperty('field', 'name');
    expect(conflictResponse).toHaveProperty(
      'details',
      'A resource with this name already exists'
    );
  });
});
