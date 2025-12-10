import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SampleService } from '@/domain/sample/sample.service';
import { SampleRepository } from '@/domain/sample/sample.repository';
import { SampleMapper } from '@/domain/sample/sample.mapper';

describe('SampleService', () => {
  let service: SampleService;
  let repository: SampleRepository;
  let mapper: SampleMapper;

  beforeEach(() => {
    repository = new SampleRepository();
    mapper = new SampleMapper();
    service = new SampleService(repository, mapper);
  });

  it('should create a sample', async () => {
    const dto = { name: 'test' };
    const result = await service.create(dto);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe('test');
    expect(result).toHaveProperty('createdAt');
  });

  it('should find all samples', async () => {
    await service.create({ name: 'test1' });
    await service.create({ name: 'test2' });

    const result = await service.findAll();

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('test1');
    expect(result[1].name).toBe('test2');
  });
});
