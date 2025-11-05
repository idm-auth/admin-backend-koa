import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock correto - latest service que é realmente usado
vi.mock('@test/utils/labs/latest/product.service', () => ({
  create: vi.fn(),
  findById: vi.fn(),
}));

import * as productController from '@test/utils/labs/v1/product.controller';
import * as productService from '@test/utils/labs/latest/product.service';

describe('Re-export Mock Problem Lab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Solução: Mock funcionando', () => {
    it('should work - mocking latest service that controller actually uses', async () => {
      // Mock do service latest
      const mockCreate = vi.mocked(productService.create);
      mockCreate.mockResolvedValue({
        id: 'mocked-123',
        name: 'Mocked Product',
        price: 999,
      });

      const ctx = {
        tenantId: 'tenant-1',
        body: { name: 'Test Product', price: 50 },
      };

      const result = await productController.create(ctx);

      console.log('Mocked Result:', result);
      // Agora o resultado será do mock
      expect(result.body.id).toBe('mocked-123');
      expect(result.body.price).toBe(999);
      expect(mockCreate).toHaveBeenCalledWith('tenant-1', {
        name: 'Test Product',
        price: 50,
      });
    });

    it('should mock error case', async () => {
      const mockCreate = vi.mocked(productService.create);
      mockCreate.mockRejectedValue(new Error('Service error'));

      const ctx = {
        tenantId: 'tenant-1',
        body: { name: 'Test Product', price: 50 },
      };

      await expect(productController.create(ctx)).rejects.toThrow(
        'Service error'
      );
      expect(mockCreate).toHaveBeenCalledWith('tenant-1', {
        name: 'Test Product',
        price: 50,
      });
    });
  });

  describe('Demonstração do problema', () => {
    it('should show re-export chain', async () => {
      // Vamos ver qual service é realmente usado
      const v1Service = await import('@test/utils/labs/v1/product.service');
      const latestService = await import(
        '@test/utils/labs/latest/product.service'
      );

      console.log(
        'v1Service.create === latestService.create:',
        v1Service.create === latestService.create
      );

      // São a mesma função devido ao re-export
      expect(v1Service.create).toBe(latestService.create);
    });

    it('should show controller re-export chain', async () => {
      // Controller v1 → re-export latest
      // Controller latest → import './product.service' (latest)
      // Portanto: Controller v1 usa Latest Service

      const v1Controller = await import(
        '@test/utils/labs/v1/product.controller'
      );
      const latestController = await import(
        '@test/utils/labs/latest/product.controller'
      );

      console.log(
        'v1Controller.create === latestController.create:',
        v1Controller.create === latestController.create
      );

      // São a mesma função devido ao re-export
      expect(v1Controller.create).toBe(latestController.create);
    });
  });

  describe('Lições aprendidas', () => {
    it('should understand the import resolution', () => {
      // Cadeia de imports:
      // 1. Teste importa: v1/product.controller
      // 2. v1/controller re-exporta: latest/product.controller
      // 3. latest/controller importa: ./product.service (latest/product.service)
      // 4. Para mockar, precisa mockar: latest/product.service

      const lesson = {
        problem: 'Mock no lugar errado devido a re-exports',
        solution: 'Descobrir qual módulo é realmente importado',
        method: 'Seguir a cadeia de imports até o final',
        correctApproach: 'Mock latest service, não v1 service',
      };

      expect(lesson.problem).toBeDefined();
      expect(lesson.solution).toBeDefined();
      expect(lesson.method).toBeDefined();
      expect(lesson.correctApproach).toBeDefined();
    });

    it('should show the debugging process', () => {
      const debugSteps = [
        '1. Teste falha - mock não funciona',
        '2. Verificar qual service o controller importa',
        '3. Controller v1 → latest → latest/service',
        '4. Mock deve ser em latest/service',
        '5. Usar vi.mock() no topo, não vi.doMock()',
      ];

      expect(debugSteps).toHaveLength(5);
      console.log('Debug process:', debugSteps);
    });
  });
});
