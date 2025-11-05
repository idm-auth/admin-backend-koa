import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock ANTES do import - SEM variáveis externas
vi.mock('@test/utils/labs/example.service', () => ({
  create: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
}));

import * as exampleService from '@test/utils/labs/example.service';

describe('Mock Examples Lab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mock Success Cases', () => {
    it('should mock create function successfully', async () => {
      // Usar vi.mocked para acessar a função mockada
      const mockCreate = vi.mocked(exampleService.create);
      const fakeUser = {
        id: 'fake-123',
        name: 'Fake User',
        email: 'fake@test.com',
      };

      mockCreate.mockResolvedValue(fakeUser);

      const result = await exampleService.create('tenant-1', {
        name: 'Test User',
        email: 'test@example.com',
      });

      expect(mockCreate).toHaveBeenCalledWith('tenant-1', {
        name: 'Test User',
        email: 'test@example.com',
      });
      expect(result).toEqual(fakeUser);
    });

    it('should mock findById function successfully', async () => {
      const mockFindById = vi.mocked(exampleService.findById);
      const fakeUser = {
        id: 'user-456',
        name: 'Found User',
        email: 'found@test.com',
      };

      mockFindById.mockResolvedValue(fakeUser);

      const result = await exampleService.findById('tenant-1', 'user-456');

      expect(mockFindById).toHaveBeenCalledWith('tenant-1', 'user-456');
      expect(result).toEqual(fakeUser);
    });
  });

  describe('Mock Error Cases', () => {
    it('should mock function to throw error', async () => {
      const mockFindById = vi.mocked(exampleService.findById);

      mockFindById.mockRejectedValue(new Error('User not found'));

      await expect(
        exampleService.findById('tenant-1', 'invalid-id')
      ).rejects.toThrow('User not found');

      expect(mockFindById).toHaveBeenCalledWith('tenant-1', 'invalid-id');
    });

    it('should mock create to fail with validation error', async () => {
      const mockCreate = vi.mocked(exampleService.create);

      mockCreate.mockRejectedValue(new Error('Invalid email format'));

      await expect(
        exampleService.create('tenant-1', {
          name: 'Test',
          email: 'invalid-email',
        })
      ).rejects.toThrow('Invalid email format');
    });
  });

  describe('Mock Implementation Examples', () => {
    it('should use mockImplementation for custom logic', async () => {
      const mockUpdate = vi.mocked(exampleService.update);

      mockUpdate.mockImplementation(async (tenantId, id, data) => {
        if (id === 'admin-user') {
          throw new Error('Cannot update admin user');
        }
        return {
          id,
          name: data.name || 'Default Name',
          email: data.email || 'default@example.com',
        };
      });

      // Test normal case
      const result = await exampleService.update('tenant-1', 'user-123', {
        name: 'Updated Name',
      });
      expect(result.name).toBe('Updated Name');

      // Test admin case
      await expect(
        exampleService.update('tenant-1', 'admin-user', { name: 'New Name' })
      ).rejects.toThrow('Cannot update admin user');
    });

    it('should use mockReturnValue for synchronous functions', () => {
      // Para funções síncronas (se tivéssemos)
      const mockFn = vi.fn();
      mockFn.mockReturnValue('sync result');

      expect(mockFn()).toBe('sync result');
    });
  });

  describe('Mock Call Verification', () => {
    it('should verify mock was called with specific arguments', async () => {
      const mockCreate = vi.mocked(exampleService.create);
      mockCreate.mockResolvedValue({
        id: 'test',
        name: 'Test',
        email: 'test@test.com',
      });

      await exampleService.create('tenant-1', {
        name: 'John',
        email: 'john@test.com',
      });

      // Verificações específicas
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledWith('tenant-1', {
        name: 'John',
        email: 'john@test.com',
      });
      expect(mockCreate).toHaveBeenLastCalledWith('tenant-1', {
        name: 'John',
        email: 'john@test.com',
      });
    });

    it('should verify multiple calls', async () => {
      const mockFindById = vi.mocked(exampleService.findById);
      mockFindById.mockResolvedValue({
        id: 'test',
        name: 'Test',
        email: 'test@test.com',
      });

      await exampleService.findById('tenant-1', 'user-1');
      await exampleService.findById('tenant-1', 'user-2');

      expect(mockFindById).toHaveBeenCalledTimes(2);
      expect(mockFindById).toHaveBeenNthCalledWith(1, 'tenant-1', 'user-1');
      expect(mockFindById).toHaveBeenNthCalledWith(2, 'tenant-1', 'user-2');
    });
  });
});
