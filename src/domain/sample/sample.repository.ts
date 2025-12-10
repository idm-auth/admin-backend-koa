import { injectable } from 'inversify';
import { SampleEntity } from '@/domain/sample/sample.entity';
import { CreateSampleDto } from '@/domain/sample/sample.dto';
import { AbstractRepository } from '@/abstract/AbstractRepository';
import { TraceAsync } from '@/infrastructure/telemetry/trace.decorator';

export const SampleRepositorySymbol = Symbol.for('SampleRepository');

@injectable()
export class SampleRepository extends AbstractRepository<
  SampleEntity,
  CreateSampleDto
> {
  private samples: SampleEntity[] = [];

  @TraceAsync('sample.repository.create')
  async create(dto: CreateSampleDto): Promise<SampleEntity> {
    const entity: SampleEntity = {
      id: Date.now().toString(),
      name: dto.name,
      createdAt: new Date(),
    };
    this.samples.push(entity);
    return entity;
  }

  @TraceAsync('sample.repository.findAll')
  async findAll(): Promise<SampleEntity[]> {
    return this.samples;
  }
}
