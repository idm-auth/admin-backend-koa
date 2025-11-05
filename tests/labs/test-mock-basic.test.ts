import { describe, expect, it, vi } from 'vitest';

// Mock ANTES do import - SEM variáveis externas
vi.mock('@/domains/realms/accounts/latest/account.service', () => ({
  create: vi.fn(),
}));

import * as accountService from '@/domains/realms/accounts/latest/account.service';

describe('Mock básico', () => {
  it('should call mock function', async () => {
    // Usar vi.mocked para acessar a função mockada
    const mockCreate = vi.mocked(accountService.create);
    mockCreate.mockResolvedValue({ _id: 'test' });

    const result = await accountService.create('tenant', { email: 'test' });

    console.log('Mock foi chamado?', mockCreate.mock.calls.length > 0);
    console.log('Result:', result);

    expect(mockCreate).toHaveBeenCalled();
    expect(result).toEqual({ _id: 'test' });
  });
});
