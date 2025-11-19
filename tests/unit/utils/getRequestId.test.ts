import { describe, expect, it } from 'vitest';
import { getRequestId } from '@/utils/localStorage.util';

describe('localStorage.util getRequestId', () => {
  it('should return "unknown" when called outside of context', () => {
    const requestId = getRequestId();
    expect(requestId).toBe('unknown');
  });
});