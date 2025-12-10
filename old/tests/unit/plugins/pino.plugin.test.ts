import { describe, expect, it, vi } from 'vitest';
import { getLogger } from '@/plugins/pino.plugin';

describe('pino.plugin.getLogger', () => {
  it('should log structured data correctly', async () => {
    const logger = await getLogger();
    const logSpy = vi.spyOn(logger, 'info');

    // Log estruturado - formato correto
    logger.info(
      { userId: '123', operation: 'create' },
      'User created successfully'
    );

    expect(logSpy).toHaveBeenCalledWith(
      { userId: '123', operation: 'create' },
      'User created successfully'
    );
  });

  it('should log errors with context', async () => {
    const logger = await getLogger();
    const logSpy = vi.spyOn(logger, 'error');

    const error = new Error('Test error');

    // Log de erro estruturado
    logger.error({ error, userId: '123' }, 'Operation failed');

    expect(logSpy).toHaveBeenCalledTimes(1);
    const [contextArg, messageArg] = logSpy.mock.calls[0];
    expect(contextArg).toMatchObject({ error, userId: '123' });
    expect(messageArg).toBe('Operation failed');
  });

  it('should log simple messages', async () => {
    const logger = await getLogger();
    const logSpy = vi.spyOn(logger, 'info');

    // Log simples
    logger.info('Simple message');

    expect(logSpy).toHaveBeenCalledWith('Simple message');
  });
});
