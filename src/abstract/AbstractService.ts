import {
  TraceAsync,
  getCurrentSpan,
} from '@/infrastructure/telemetry/trace.decorator';

export abstract class AbstractService<TEntity, TDto, TCreateDto> {
  protected abstract repository: {
    create(data: any): Promise<TEntity>;
    findAll(): Promise<TEntity[]>;
  };

  protected abstract mapper: {
    toDto(entity: TEntity): TDto;
    toDtoList(entities: TEntity[]): TDto[];
  };

  protected abstract getServiceName(): string;

  @TraceAsync()
  async create(dto: TCreateDto): Promise<TDto> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getServiceName()}.service.create`);
    }

    const entity = await this.repository.create(dto);
    return this.mapper.toDto(entity);
  }

  @TraceAsync()
  async findAll(): Promise<TDto[]> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getServiceName()}.service.findAll`);
    }

    const entities = await this.repository.findAll();

    if (span) {
      span.setAttributes({ count: entities.length });
    }

    return this.mapper.toDtoList(entities);
  }
}
