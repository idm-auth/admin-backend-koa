import { describe, it, expect } from 'vitest';
import service from '@/services/latest/config.service';

describe('config.service', () => {
  it('getConfig.OK', async () => {
    const result = await service.getConfig({
      app: 'web-admin',
      env: 'development',
    });
    expect(result).toEqual({
      app: 'web-admin',
      env: 'development',
      api: { main: { url: '' } },
    });
  });
});
