import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock correto - example service que existe
vi.mock('@test/utils/labs/example.service', () => ({
  create: vi.fn(),
  findById: vi.fn(),
}));

import * as exampleService from '@test/utils/labs/example.service';

describe('Mock Working Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mock básico funcionando', () => {
    it('should work - mocking example service', async () => {
      // Mock do service example
      const mockCreate = vi.mocked(exampleService.create);
      mockCreate.mockResolvedValue({
        id: 'mocked-123',
        name: 'Mocked User',
        email: 'mocked@example.com',
      });

      const result = await exampleService.create('tenant-1', {
        name: 'Test User',
        email: 'test@example.com',
      });

      console.log('Mocked Result:', result);
      // Agora o resultado será do mock
      expect(result.id).toBe('mocked-123');
      expect(result.name).toBe('Mocked User');
      expect(mockCreate).toHaveBeenCalledWith('tenant-1', {
        name: 'Test User',
        email: 'test@example.com',
      });
    });

    it('should mock error case', async () => {
      const mockCreate = vi.mocked(exampleService.create);
      mockCreate.mockRejectedValue(new Error('Service error'));

      await expect(
        exampleService.create('tenant-1', {
          name: 'Test User',
          email: 'test@example.com',
        })
      ).rejects.toThrow('Service error');

      expect(mockCreate).toHaveBeenCalledWith('tenant-1', {
        name: 'Test User',
        email: 'test@example.com',
      });
    });
  });

  describe('Demonstração de mock básico', () => {
    it('should show mock working correctly', () => {
      const mockInfo = {
        target: '@test/utils/labs/example.service',
        method: 'vi.mock() antes dos imports',
        access: 'vi.mocked() para acessar função mockada',
        verification: 'expect().toHaveBeenCalledWith()',
      };

      expect(mockInfo.target).toBe('@test/utils/labs/example.service');
      console.log('Mock info:', mockInfo);
    });
  });

  describe('Lições de mock', () => {
    it('should understand mock principles', () => {
      const principle = {
        rule: 'Mock o módulo que você quer substituir',
        timing: 'vi.mock() deve vir ANTES dos imports',
        access: 'Use vi.mocked() para acessar funções mockadas',
        verification: 'Sempre verificar se mock foi chamado corretamente',
      };

      expect(principle.rule).toBeDefined();
      console.log('Mock principles:', principle);
    });
  });
});
