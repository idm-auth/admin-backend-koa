import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock correto - v1 service que é realmente usado pelo latest controller
vi.mock('@test/utils/labs/v1/order.service', () => ({
  create: vi.fn(),
  findById: vi.fn(),
}));

import * as orderController from '@test/utils/labs/v1/order.controller';
import * as orderService from '@test/utils/labs/v1/order.service';

describe('Reverse Import Working Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Cenário Inverso: Latest controller usa V1 service', () => {
    it('should work - mocking v1 service that latest controller actually uses', async () => {
      // Mock do service v1 (que é usado pelo latest controller)
      const mockCreate = vi.mocked(orderService.create);
      mockCreate.mockResolvedValue({
        id: 'mocked-v1-123',
        product: 'Mocked Order',
        quantity: 777,
      });

      const ctx = {
        tenantId: 'tenant-1',
        body: { product: 'Test Order', quantity: 2 }
      };

      const result = await orderController.create(ctx);
      
      console.log('Mocked Result (reverse scenario):', result);
      // Agora o resultado será do mock
      expect(result.body.id).toBe('mocked-v1-123');
      expect(result.body.quantity).toBe(777);
      expect(mockCreate).toHaveBeenCalledWith('tenant-1', {
        product: 'Test Order',
        quantity: 2,
      });
    });

    it('should mock error case in reverse scenario', async () => {
      const mockCreate = vi.mocked(orderService.create);
      mockCreate.mockRejectedValue(new Error('V1 Service error'));

      const ctx = {
        tenantId: 'tenant-1',
        body: { product: 'Test Order', quantity: 2 }
      };

      await expect(orderController.create(ctx)).rejects.toThrow('V1 Service error');
      expect(mockCreate).toHaveBeenCalledWith('tenant-1', {
        product: 'Test Order',
        quantity: 2,
      });
    });
  });

  describe('Demonstração da cadeia inversa', () => {
    it('should show the reverse import chain', () => {
      // Cadeia de imports INVERSA:
      // 1. Teste importa: v1/order.controller
      // 2. v1/controller re-exporta: latest/order.controller
      // 3. latest/controller importa: ../v1/order.service
      // 4. Para mockar: v1/order.service (não latest!)
      
      const importChain = {
        test: 'v1/order.controller',
        v1Controller: 'latest/order.controller (re-export)',
        latestController: '../v1/order.service (import direto)',
        mockTarget: 'v1/order.service',
        wrongTarget: 'latest/order.service (não funciona)'
      };
      
      expect(importChain.mockTarget).toBe('v1/order.service');
      console.log('Reverse import chain:', importChain);
    });

    it('should prove services are the same due to re-export', async () => {
      const v1Service = await import('@test/utils/labs/v1/order.service');
      const latestService = await import('@test/utils/labs/latest/order.service');
      
      // latest/service re-exporta v1/service, então são iguais
      expect(v1Service.create).toBe(latestService.create);
      console.log('Services are identical due to re-export');
    });
  });

  describe('Lição do cenário inverso', () => {
    it('should understand the key principle', () => {
      const principle = {
        rule: 'Mock onde o import REALMENTE aponta',
        scenario1: 'latest/controller → ./service = mock latest/service',
        scenario2: 'latest/controller → ../v1/service = mock v1/service',
        keyPoint: 'Não importa a versão, importa o PATH real do import',
        debugging: 'Sempre verificar qual arquivo tem o import direto'
      };
      
      expect(principle.rule).toBeDefined();
      console.log('Key principle:', principle);
    });
  });
});