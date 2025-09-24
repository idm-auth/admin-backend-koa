import { describe, it, expect } from 'vitest';
import * as LatestSchema from '@/schemas/latest/sample.export.schema';
import * as V1Schema from '@/schemas/v1/sample.export.schema';

describe('Sample Export Schema Override', () => {
  describe('Latest Schema', () => {
    it('should have all 4 methods with latest implementation', () => {
      expect(LatestSchema.A()).toBe('A latest');
      expect(LatestSchema.B()).toBe('B latest');
      expect(LatestSchema.C()).toBe('C latest');
      expect(LatestSchema.D()).toBe('D latest');
    });
  });

  describe('V1 Schema', () => {
    it('should keep A and C from latest unchanged', () => {
      expect(V1Schema.A()).toBe('A latest');
      expect(V1Schema.C()).toBe('C latest');
    });

    it('should completely override B', () => {
      expect(V1Schema.B()).toBe('B v1 override');
      expect(V1Schema.B()).not.toBe(LatestSchema.B());
    });

    it('should extend D by calling latest and adding more', () => {
      expect(V1Schema.D()).toBe('D latest + D v1 extension');
      expect(V1Schema.D()).toContain(LatestSchema.D());
    });

    it('should have all 4 methods available', () => {
      expect(typeof V1Schema.A).toBe('function');
      expect(typeof V1Schema.B).toBe('function');
      expect(typeof V1Schema.C).toBe('function');
      expect(typeof V1Schema.D).toBe('function');
    });
  });
});
