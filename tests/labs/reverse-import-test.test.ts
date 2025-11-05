import { describe, expect, it, vi, beforeEach } from 'vitest';

describe('Reverse Import Test - Latest imports V1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Cenário: Latest controller importa V1 service', () => {
    it('should demonstrate the reverse chain', async () => {
      // Cadeia de imports INVERSA:
      // 1. Teste importa: v1/order.controller
      // 2. v1/controller re-exporta: latest/order.controller
      // 3. latest/controller importa: ../v1/order.service (v1/order.service)
      // 4. Para mockar, precisa mockar: v1/order.service (não latest!)
      
      const v1Service = await import('@test/utils/labs/v1/order.service');
      const latestService = await import('@test/utils/labs/latest/order.service');
      
      console.log('v1Service.create === latestService.create:', v1Service.create === latestService.create);
      
      // São a mesma função devido ao re-export (latest re-exporta v1)
      expect(v1Service.create).toBe(latestService.create);
    });

    it('should show controller chain', async () => {
      const v1Controller = await import('@test/utils/labs/v1/order.controller');
      const latestController = await import('@test/utils/labs/latest/order.controller');
      
      console.log('v1Controller.create === latestController.create:', v1Controller.create === latestController.create);
      
      // São a mesma função devido ao re-export (v1 re-exporta latest)
      expect(v1Controller.create).toBe(latestController.create);
    });
  });

  describe('Mock Test - Cenário Inverso', () => {
    it('should fail if mocking latest service', async () => {
      // Mock no lugar ERRADO para este cenário
      vi.doMock('@test/utils/labs/latest/order.service', () => ({
        create: vi.fn().mockResolvedValue({ id: 'mocked-latest', product: 'Latest Mock', quantity: 999 }),
      }));

      const { create } = await import('@test/utils/labs/v1/order.controller');
      
      const ctx = {
        tenantId: 'tenant-1',
        body: { product: 'Test Order', quantity: 2 }
      };

      const result = await create(ctx);
      
      console.log('Result with latest mock:', result);
      // Vai executar código real do V1 service
      expect(result.body.product).toBe('Test Order'); // Código real do V1
    });

    it('should work if mocking v1 service', async () => {
      // Mock no lugar CORRETO para este cenário
      vi.doMock('@test/utils/labs/v1/order.service', () => ({
        create: vi.fn().mockResolvedValue({ id: 'mocked-v1', product: 'V1 Mock', quantity: 888 }),
      }));

      const { create } = await import('@test/utils/labs/v1/order.controller');
      
      const ctx = {
        tenantId: 'tenant-1',
        body: { product: 'Test Order', quantity: 2 }
      };

      const result = await create(ctx);
      
      console.log('Result with v1 mock:', result);
      // Agora o resultado será do mock
      expect(result.body.id).toBe('mocked-v1');
      expect(result.body.quantity).toBe(888);
    });
  });

  describe('Lição do cenário inverso', () => {
    it('should understand that mock location depends on actual import', () => {
      const lesson = {
        scenario: 'Latest controller importa V1 service',
        chain: 'v1/controller → latest/controller → v1/service',
        correctMock: 'Mock deve ser em v1/service',
        wrongMock: 'Mock em latest/service não funciona',
        rule: 'Sempre seguir a cadeia real de imports'
      };
      
      expect(lesson.scenario).toBeDefined();
      expect(lesson.correctMock).toBeDefined();
      console.log('Reverse scenario lesson:', lesson);
    });
  });
});