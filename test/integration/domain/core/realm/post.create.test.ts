import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { getApp } from '@test/setup/base.setup';
import { dropTestDatabase, setTestDatabase } from '@test/utils/database.util';

/**
 * Testes de integração para criação de Realm.
 * 
 * Isolamento de dados:
 * - Cada arquivo de teste usa seu próprio banco de dados
 * - beforeAll configura banco isolado: 'vi-test-db-core-realm-post'
 * - afterAll apaga o banco após os testes
 * - Evita conflitos entre testes rodando em paralelo
 */
describe('POST /api/core/realm', () => {
  beforeAll(() => {
    setTestDatabase('vi-test-db-core-realm-post');
  });

  afterAll(async () => {
    await dropTestDatabase();
  });

  it('should create a new realm successfully', async () => {
    // Dados do realm a ser criado
    // Usa timestamp para garantir unicidade (name e dbName são unique)
    const realmData = {
      name: `test-realm-${Date.now()}`,
      description: 'Test realm',
      dbName: `test-db-${Date.now()}`,
    };

    // Faz requisição HTTP POST para criar realm
    const response = await request(getApp().callback())
      .post('/api/core/realm')
      .send(realmData)
      .expect(201); // Espera status 201 Created

    // Valida resposta
    expect(response.body).toHaveProperty('_id'); // MongoDB gerou ID
    expect(response.body.name).toBe(realmData.name);
    expect(response.body.description).toBe(realmData.description);
    expect(response.body.dbName).toBe(realmData.dbName);
    expect(response.body).toHaveProperty('publicUUID'); // UUID gerado automaticamente
    expect(response.body).toHaveProperty('jwtConfig'); // JWT config com defaults
  });
});
