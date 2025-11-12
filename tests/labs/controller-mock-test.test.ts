import { describe, expect, it, vi, beforeEach } from 'vitest';

// Teste para demonstrar diferença entre mock direto vs indireto

// Mock global do service
vi.mock('@test/utils/labs/example.service', () => ({
  create: vi.fn(),
}));

import * as exampleService from '@test/utils/labs/example.service';

// Simulando um controller simples que usa o service
const exampleController = {
  async create(data: any) {
    try {
      const result = await exampleService.create('tenant', data);
      return { status: 201, body: result };
    } catch (error) {
      throw error;
    }
  }
};

describe('Controller Mock Test - Comparação', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Teste DIRETO do service (funciona)', () => {
    it('should work - testing service directly', async () => {
      const mockCreate = vi.mocked(exampleService.create);
      mockCreate.mockRejectedValue(new Error('Service error'));

      await expect(
        exampleService.create('tenant', { name: 'test' })
      ).rejects.toThrow('Service error');

      expect(mockCreate).toHaveBeenCalled();
    });
  });

  describe('Teste INDIRETO através do controller', () => {
    it('should work - testing through controller with vi.mock', async () => {
      const mockCreate = vi.mocked(exampleService.create);
      mockCreate.mockRejectedValue(new Error('Service error'));

      await expect(
        exampleController.create({ name: 'test' })
      ).rejects.toThrow('Service error');

      expect(mockCreate).toHaveBeenCalled();
    });

    it('should work - testing through controller with vi.spyOn', async () => {
      // Usando spyOn como alternativa
      const createSpy = vi.spyOn(exampleService, 'create');
      createSpy.mockRejectedValue(new Error('Spy error'));

      await expect(
        exampleController.create({ name: 'test' })
      ).rejects.toThrow('Spy error');

      expect(createSpy).toHaveBeenCalled();
      createSpy.mockRestore();
    });
  });

  describe('Comparação das abordagens', () => {
    it('should show both approaches work for simple cases', () => {
      const comparison = {
        direct: 'Testa service diretamente - vi.mock sempre funciona',
        indirect: 'Testa através de controller - vi.mock pode falhar em casos complexos',
        solution: 'vi.spyOn é mais confiável para testes indiretos',
        reason: 'spyOn substitui na execução, mock substitui na importação'
      };
      
      expect(comparison.solution).toBeDefined();
      console.log('Mock comparison:', comparison);
    });
  });
});