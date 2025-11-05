import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { Context } from 'koa';
import { getTenantId } from '@test/utils/tenant.util';

// Mock CORRETO - sem variáveis externas
vi.mock('@/domains/realms/accounts/latest/account.service', () => ({
  create: vi.fn(),
  findById: vi.fn(),
}));

import * as accountController from '@/domains/realms/accounts/v1/account.controller';
import * as accountService from '@/domains/realms/accounts/latest/account.service';

describe('account.controller error handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle create errors', async () => {
    const tenantId = await getTenantId('test-controller-error');

    // Usar vi.mocked para acessar a função mockada
    const mockCreate = vi.mocked(accountService.create);
    mockCreate.mockRejectedValue(new Error('Service error'));

    const ctx = {
      validated: {
        params: { tenantId },
        body: { email: 'test@example.com', password: 'Password123!' },
      },
      status: 0,
      body: null,
    } as unknown as Context;

    await expect(accountController.create(ctx)).rejects.toThrow('Service error');

    // Verificar se o service foi chamado
    expect(mockCreate).toHaveBeenCalledWith(tenantId, {
      email: 'test@example.com',
      password: 'Password123!',
    });
  });

  it('should handle findById errors', async () => {
    const tenantId = await getTenantId('test-controller-error-find');

    const ctx = {
      validated: {
        params: { tenantId, id: 'invalid-uuid' }, // ID inválido para forçar erro
      },
      status: 0,
      body: null,
    } as unknown as Context;

    await expect(accountController.findById(ctx)).rejects.toThrow();
  });
});
