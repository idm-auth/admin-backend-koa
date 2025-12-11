import {
  TraceAsync,
  getCurrentSpan,
} from '@/infrastructure/telemetry/trace.decorator';
import {
  IRepository,
  MongoPaginationOptions,
} from '@/abstract/AbstractMongoRepository';
import { PaginatedResponse, PaginationQuery } from '@/common/pagination.dto';
import type { QueryFilter } from 'mongoose';

export abstract class AbstractService<TEntity, TDto, TCreateDto> {
  protected abstract repository: IRepository<TEntity>;

  protected abstract mapper: {
    toDto(entity: TEntity): TDto;
    toDtoList(entities: TEntity[]): TDto[];
  };

  protected abstract getServiceName(): string;

  @TraceAsync()
  async create(dbName: string, dto: TCreateDto): Promise<TDto> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getServiceName()}.service.create`);
    }

    const entity = await this.repository.create(dbName, dto);
    return this.mapper.toDto(entity);
  }

  @TraceAsync()
  async findById(dbName: string, id: string): Promise<TDto | null> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getServiceName()}.service.findById`);
    }

    const entity = await this.repository.findById(dbName, id);
    return entity ? this.mapper.toDto(entity) : null;
  }

  @TraceAsync()
  async findOne(
    dbName: string,
    filter: QueryFilter<TEntity>
  ): Promise<TDto | null> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getServiceName()}.service.findOne`);
    }

    const entity = await this.repository.findOne(dbName, filter);
    return entity ? this.mapper.toDto(entity) : null;
  }

  @TraceAsync()
  async findAll(dbName: string, filter?: QueryFilter<TEntity>): Promise<TDto[]> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getServiceName()}.service.findAll`);
    }

    const entities = await this.repository.findAll(dbName, filter);

    if (span) {
      span.setAttributes({ count: entities.length });
    }

    return this.mapper.toDtoList(entities);
  }

  @TraceAsync()
  async update(dbName: string, id: string, data: Partial<TEntity>): Promise<TDto | null> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getServiceName()}.service.update`);
    }

    const entity = await this.repository.update(dbName, id, data);
    return entity ? this.mapper.toDto(entity) : null;
  }

  @TraceAsync()
  async delete(dbName: string, id: string): Promise<TDto | null> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getServiceName()}.service.delete`);
    }

    const entity = await this.repository.delete(dbName, id);
    return entity ? this.mapper.toDto(entity) : null;
  }

  @TraceAsync()
  async count(dbName: string, filter?: QueryFilter<TEntity>): Promise<number> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getServiceName()}.service.count`);
    }

    return this.repository.count(dbName, filter);
  }

  @TraceAsync()
  async findAllPaginated(
    dbName: string,
    query: PaginationQuery
  ): Promise<PaginatedResponse<TDto>> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getServiceName()}.service.findAllPaginated`);
      span.setAttributes({
        'pagination.page': query.page,
        'pagination.limit': query.limit,
      });
    }

    const page = query.page || 1;
    const limit = query.limit || 25;
    const skip = (page - 1) * limit;

    const filter: QueryFilter<TEntity> = {};

    const options: MongoPaginationOptions = {
      page,
      limit,
      skip,
      sortBy: query.sortBy,
      descending: query.descending,
    };

    const result = await this.repository.findAllPaginated(
      dbName,
      filter,
      options
    );

    if (span) {
      span.setAttributes({
        total: result.total,
        count: result.data.length,
      });
    }

    return {
      data: this.mapper.toDtoList(result.data),
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
