import { beforeAll, describe, expect, it } from 'vitest';

import { JwtPayload } from '@/schemas/latest/jwt.schema';
import * as jwtService from '@/services/v1/jwt.service';
import { getTenantId } from '@test/utils/tenant.util';

describe('JWT Service', () => {
  let tenantId: string;
  const mockPayload: JwtPayload = {
    accountId: 'account-123',
    email: 'test@example.com',
  };

  beforeAll(async () => {
    tenantId = await getTenantId('test-jwt-service');
  });

  describe('generateToken', () => {
    it('deve gerar token com sucesso', async () => {
      const result = await jwtService.generateToken(tenantId, mockPayload);

      expect(typeof result).toBe('string');
    });

    it('deve lançar erro para payload inválido', async () => {
      const invalidPayload = { accountId: '' } as JwtPayload;

      await expect(
        jwtService.generateToken(tenantId, invalidPayload)
      ).rejects.toThrow();
    });
  });

  describe('verifyToken', () => {
    it('deve verificar token com sucesso', async () => {
      const token = await jwtService.generateToken(tenantId, mockPayload);
      const result = await jwtService.verifyToken(tenantId, token);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('accountId', mockPayload.accountId);
      expect(result).toHaveProperty('email', mockPayload.email);
    });

    it('deve lançar erro para token inválido', async () => {
      await expect(
        jwtService.verifyToken(tenantId, 'token-invalido')
      ).rejects.toThrow();
    });
  });
});
