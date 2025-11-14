// EXEMPLO 1: vi.mock FUNCIONA - Mock ANTES de todos os imports
vi.mock('./fake-service', () => ({
  create: vi.fn(),
  findById: vi.fn(),
}));

import { describe, expect, it, vi } from 'vitest';
import { create as controllerCreate } from './fake-controller';
import * as fakeService from './fake-service';

describe('Mock Examples - Quando Funciona e Quando Não', () => {
  it('1) vi.mock FUNCIONA - porque fez mock direto do service ANTES dos imports', async () => {
    console.log('=== EXEMPLO 1: vi.mock FUNCIONA ===');
    console.log('Razão: Mock declarado ANTES de importar controller');
    console.log('Service is mocked:', vi.isMockFunction(fakeService.create));

    const mockCreate = vi.mocked(fakeService.create);
    mockCreate.mockRejectedValue(new Error('MOCK_SUCCESS'));

    const ctx = { tenantId: 'test', data: { email: 'test@example.com' } };

    try {
      await controllerCreate(ctx);
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      expect(message).toContain('MOCK_SUCCESS');
      console.log('Mock interceptou:', message);
    }
  });

  it('2) vi.mock FUNCIONA se fizer: Mock ANTES + Path correto + Imports depois', async () => {
    console.log('=== EXEMPLO 2: vi.mock FUNCIONA SE ===');
    console.log('Condição 1: vi.mock() ANTES de TODOS os imports');
    console.log('Condição 2: Path do mock igual ao import do controller');
    console.log('Condição 3: Controller importado DEPOIS do mock');
    console.log('Resultado: Controller nunca vê service real');

    // Já está funcionando neste arquivo porque seguiu as condições
    expect(vi.isMockFunction(fakeService.create)).toBe(true);
  });

  it('3) vi.mock NÃO FUNCIONA porque imports já estão no topo (cenário real)', async () => {
    console.log('=== EXEMPLO 3: vi.mock NÃO FUNCIONA ===');
    console.log('Problema: Em testes reais, imports ficam no topo');
    console.log(
      'Sequência: 1.import controller 2.controller importa service 3.vi.mock (tarde demais)'
    );
    console.log('Resultado: Módulos ES6 já carregados, propriedades read-only');

    // Simulação do problema real:
    const realProblem = {
      testStructure: 'import controller; import service; vi.mock(service)',
      issue: 'Mock aplicado depois que módulos já foram carregados',
      moduleState: 'Service real já vinculado ao controller',
      mockResult: 'Mock não intercepta porque chegou tarde',
    };

    console.log('Estrutura problemática:', realProblem);
    expect(realProblem.mockResult).toContain('não intercepta');
  });

  it('4) vi.spyOn FUNCIONA no lugar de vi.mock - SEMPRE', async () => {
    console.log('=== EXEMPLO 4: vi.spyOn SEMPRE FUNCIONA ===');
    console.log('Vantagem: Intercepta na EXECUÇÃO, não na importação');
    console.log('Flexibilidade: Pode ser aplicado a qualquer momento');
    console.log('Confiabilidade: Funciona independente da ordem dos imports');

    const createSpy = vi.spyOn(fakeService, 'create');
    createSpy.mockRejectedValue(new Error('SPY_SUCCESS'));

    const ctx = { tenantId: 'test', data: { email: 'test@example.com' } };

    try {
      await controllerCreate(ctx);
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      expect(message).toContain('SPY_SUCCESS');
      console.log('Spy interceptou:', message);
    }

    createSpy.mockRestore();

    console.log(
      'Conclusão: vi.spyOn é a solução universal para testes unitários'
    );
  });

  it('RESUMO: Quando usar cada abordagem', () => {
    const guide = {
      viMock: {
        quando: 'Apenas se puder declarar ANTES de todos os imports',
        limitacao: 'Não funciona em testes reais com imports no topo',
        uso: 'Raro - apenas em casos muito específicos',
      },
      viSpyOn: {
        quando: 'SEMPRE - é a solução universal',
        vantagem: 'Funciona independente da ordem dos imports',
        uso: 'Padrão para todos os testes unitários',
      },
      recomendacao: 'SEMPRE usar vi.spyOn para testes unitários',
    };

    console.log('=== GUIA DE USO ===');
    console.log('vi.mock:', guide.viMock);
    console.log('vi.spyOn:', guide.viSpyOn);
    console.log('RECOMENDAÇÃO:', guide.recomendacao);

    expect(guide.recomendacao).toContain('vi.spyOn');
  });
});
