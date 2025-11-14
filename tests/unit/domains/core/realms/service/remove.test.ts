import { NotFoundError } from '@/errors/not-found';
import { describe, expect, it } from 'vitest';
import * as realmService from '@/domains/core/realms/realm.service';

describe('realm.service.remove', () => {
  it('should throw NotFoundError when realm not found', async () => {
    await expect(
      realmService.remove('550e8400-e29b-41d4-a716-446655440000')
    ).rejects.toThrow(NotFoundError);
  });
});
