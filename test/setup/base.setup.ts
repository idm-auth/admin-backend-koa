import { bootstrap } from '@/infrastructure/core/bootstrap';
import { Container } from 'inversify';
import type Koa from 'koa';
import { Framework } from 'koa-inversify-framework';
import { afterAll, beforeAll } from 'vitest';

/**
 * Setup global para testes de integração.
 *
 * Por que isso existe:
 * - Inicializa o framework completo uma única vez para todos os testes
 * - Evita overhead de criar/destruir o framework para cada teste
 * - Compartilha a mesma instância do Koa app entre todos os testes
 *
 * Como funciona:
 * 1. beforeAll (executado uma vez antes de todos os testes):
 *    - Cria container do Inversify
 *    - Configura framework com TenantResolver e Env customizados
 *    - Inicializa MongoDB, Koa, Swagger, etc
 *    - Registra todos os módulos da aplicação (core + realm)
 *    - Expõe o Koa app para os testes usarem
 *
 * 2. afterAll (executado uma vez após todos os testes):
 *    - Fecha conexões (MongoDB, Telemetry, etc)
 *    - Limpa recursos
 *
 * Importante:
 * - O container é exportado para permitir acesso ao Env nos testes
 * - Cada teste pode mudar o banco de dados via setTestDatabase()
 * - O framework NÃO é reinicializado entre testes (performance)
 */

let framework: Framework;
let app: Koa;
let container: Container;

beforeAll(async () => {
  ({ framework, container, app } = await bootstrap());
});

afterAll(async () => {
  await framework.shutdown();
});

// Exporta app para testes fazerem requisições HTTP
export const getApp = () => app;

// Exporta container para testes acessarem serviços (ex: mudar banco de dados)
export const getContainer = () => container;