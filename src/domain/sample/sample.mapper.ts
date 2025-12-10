import { injectable } from 'inversify';
import { SampleEntity } from '@/domain/sample/sample.entity';
import { SampleDto } from '@/domain/sample/sample.dto';
import { AbstractMapper } from '@/abstract/AbstractMapper';
import { Trace } from '@/infrastructure/telemetry/trace.decorator';

export const SampleMapperSymbol = Symbol.for('SampleMapper');

@injectable()
export class SampleMapper extends AbstractMapper<SampleEntity, SampleDto> {
  @Trace('sample.mapper.toDto')
  toDto(entity: SampleEntity): SampleDto {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
