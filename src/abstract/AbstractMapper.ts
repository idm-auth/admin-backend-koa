import { Trace } from '@/infrastructure/telemetry/trace.decorator';

export abstract class AbstractMapper<TEntity, TDto> {
  abstract toDto(entity: TEntity): TDto;

  @Trace()
  toDtoList(entities: TEntity[]): TDto[] {
    return entities.map((e) => this.toDto(e));
  }
}
