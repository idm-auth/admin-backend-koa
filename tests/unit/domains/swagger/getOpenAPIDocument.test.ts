import { describe, expect, it } from 'vitest';
import { getOpenAPIDocument } from '@/domains/swagger/openApiGenerator';

describe('openApiGenerator getOpenAPIDocument', () => {
  it('should generate OpenAPI document', () => {
    const doc = getOpenAPIDocument();

    expect(doc).toHaveProperty('openapi', '3.0.0');
    expect(doc).toHaveProperty('info');
    expect(doc.info).toHaveProperty('title', 'Multi-Tenant API');
    expect(doc).toHaveProperty('servers');
    expect(doc).toHaveProperty('tags');
  });
});
