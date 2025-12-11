import { IMapper } from '@/abstract/AbstractMapper';
import {
  IRepository,
  MongoPaginationOptions,
} from '@/abstract/AbstractMongoRepository';
import { DtoTypes } from '@/common/dto.types';
import { PaginatedResponse, PaginationQuery } from '@/common/pagination.dto';
import {
  TraceAsync,
  getCurrentSpan,
} from '@/infrastructure/telemetry/trace.decorator';
import type {
  ApplyBasicCreateCasting,
  DeepPartial,
  InferSchemaType,
  QueryFilter,
  Require_id,
  Schema,
  UpdateQuery,
} from 'mongoose';

export interface IService<TSchema extends Schema, T extends DtoTypes> {
  create(
    dbName: string,
    dto: T['CreateRequestDto']
  ): Promise<T['CreateResponseDto']>;
  findById(
    dbName: string,
    id: string
  ): Promise<T['FindByIdResponseDto'] | null>;
  findOne(
    dbName: string,
    filter: QueryFilter<InferSchemaType<TSchema>>
  ): Promise<T['FindOneResponseDto'] | null>;
  findAll(
    dbName: string,
    filter?: QueryFilter<InferSchemaType<TSchema>>
  ): Promise<T['FindAllResponseDto']>;
  update(
    dbName: string,
    id: string,
    data: T['UpdateRequestDto']
  ): Promise<T['UpdateResponseDto'] | null>;
  delete(dbName: string, id: string): Promise<T['DeleteResponseDto'] | null>;
  count(
    dbName: string,
    filter?: QueryFilter<InferSchemaType<TSchema>>
  ): Promise<number>;
  findAllPaginated(
    dbName: string,
    query: PaginationQuery
  ): Promise<PaginatedResponse<T['PaginatedResponseDto']>>;
}

export abstract class AbstractService<
  TSchema extends Schema,
  T extends DtoTypes,
> implements IService<TSchema, T> {
  protected abstract repository: IRepository<TSchema>;
  protected abstract mapper: IMapper<TSchema, T>;

  protected abstract getServiceName(): string;

  protected buildCreateData(
    dto: T['CreateRequestDto']
  ): DeepPartial<
    ApplyBasicCreateCasting<Require_id<InferSchemaType<TSchema>>>
  > {
    return dto as DeepPartial<
      ApplyBasicCreateCasting<Require_id<InferSchemaType<TSchema>>>
    >;
  }

  protected buildUpdateQuery(
    data: T['UpdateRequestDto']
  ): UpdateQuery<InferSchemaType<TSchema>> {
    return { $set: data } as UpdateQuery<InferSchemaType<TSchema>>;
  }

  @TraceAsync()
  async create(
    dbName: string,
    dto: T['CreateRequestDto']
  ): Promise<T['CreateResponseDto']> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getServiceName()}.service.create`);
    }

    const createData = this.buildCreateData(dto);
    const entity = await this.repository.create(dbName, createData);
    return this.mapper.toCreateResponseDto(entity);
  }

  @TraceAsync()
  async findById(
    dbName: string,
    id: string
  ): Promise<T['FindByIdResponseDto'] | null> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getServiceName()}.service.findById`);
    }

    const entity = await this.repository.findById(dbName, id);
    return entity ? this.mapper.toFindByIdResponseDto(entity) : null;
  }

  @TraceAsync()
  async findOne(
    dbName: string,
    filter: QueryFilter<InferSchemaType<TSchema>>
  ): Promise<T['FindOneResponseDto'] | null> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getServiceName()}.service.findOne`);
    }

    const entity = await this.repository.findOne(dbName, filter);
    return entity ? this.mapper.toFindOneResponseDto(entity) : null;
  }

  @TraceAsync()
  async findAll(
    dbName: string,
    filter?: QueryFilter<InferSchemaType<TSchema>>
  ): Promise<T['FindAllResponseDto']> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getServiceName()}.service.findAll`);
    }

    const entities = await this.repository.findAll(dbName, filter);

    if (span) {
      span.setAttributes({ count: entities.length });
    }

    return this.mapper.toFindAllResponseDto(entities);
  }

  @TraceAsync()
  async update(
    dbName: string,
    id: string,
    data: T['UpdateRequestDto']
  ): Promise<T['UpdateResponseDto'] | null> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getServiceName()}.service.update`);
    }

    const updateQuery = this.buildUpdateQuery(data);
    const entity = await this.repository.update(dbName, id, updateQuery);
    return entity ? this.mapper.toUpdateResponseDto(entity) : null;
  }

  @TraceAsync()
  async delete(
    dbName: string,
    id: string
  ): Promise<T['DeleteResponseDto'] | null> {
    const span = getCurrentSpan();
    if (span) {
      span.updateName(`${this.getServiceName()}.service.delete`);
    }

    const entity = await this.repository.delete(dbName, id);
    return entity ? this.mapper.toDeleteResponseDto(entity) : null;
  }

  @TraceAsync()
  async count(
    dbName: string,
    filter?: QueryFilter<InferSchemaType<TSchema>>
  ): Promise<number> {
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
  ): Promise<PaginatedResponse<T['PaginatedResponseDto']>> {
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

    const filter: QueryFilter<InferSchemaType<TSchema>> = {};

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
      data: this.mapper.toPaginatedResponseDto(result.data),
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
