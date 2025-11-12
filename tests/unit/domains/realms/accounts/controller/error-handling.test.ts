import { getTenantId } from '@test/utils/tenant.util';
import { Context } from 'koa';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Sem mocks globais - usar spyOn nos testes

import * as accountController from '@/domains/realms/accounts/account.controller';
import * as accountService from '@/domains/realms/accounts/account.service';

describe('account.controller error handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks(); // Restaura todos os spies
  });

  it('should handle create errors', async () => {
    const tenantId = await getTenantId('test-controller-error');

    // Usar spyOn para garantir que o mock funcione
    const createSpy = vi.spyOn(accountService, 'create');
    createSpy.mockRejectedValue(new Error('Service error'));

    const ctx = {
      validated: {
        params: { tenantId },
        body: { email: 'test@example.com', password: 'Password123!' },
      },
      status: 0,
      body: null,
    } as unknown as Context;

    await expect(accountController.create(ctx)).rejects.toThrow(
      'Service error'
    );

    expect(createSpy).toHaveBeenCalledWith(tenantId, {
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
