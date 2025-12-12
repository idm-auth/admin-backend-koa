import { PaginatedResult } from '@/common/pagination.dto';
import {
  MongoDB,
  MongoDBSymbol,
} from '@/infrastructure/mongodb/mongodb.provider';
import { Trace, TraceAsync } from '@/infrastructure/telemetry/trace.decorator';
import { inject } from 'inversify';
import type {
  ApplyBasicCreateCasting,
  CompileModelOptions,
  DeepPartial,
  HydratedDocument,
  InferSchemaType,
  Model,
  QueryFilter,
  Require_id,
  Schema,
  UpdateQuery,
} from 'mongoose';

export interface MongoPaginationOptions {
  page: number;
  limit: number;
  skip: number;
  sortBy?: string;
  descending?: boolean;
}

export interface IRepository<TSchema extends Schema> {
  getCollection(dbName: string): Model<InferSchemaType<TSchema>>;
  create(
    dbName: string,
    data: DeepPartial<
      ApplyBasicCreateCasting<Require_id<InferSchemaType<TSchema>>>
    >
  ): Promise<HydratedDocument<InferSchemaType<TSchema>>>;
  findById(
    dbName: string,
    id: string
  ): Promise<HydratedDocument<InferSchemaType<TSchema>> | null>;
  findOne(
    dbName: string,
    filter: QueryFilter<InferSchemaType<TSchema>>
  ): Promise<HydratedDocument<InferSchemaType<TSchema>> | null>;
  findAll(
    dbName: string,
    filter?: QueryFilter<InferSchemaType<TSchema>>
  ): Promise<HydratedDocument<InferSchemaType<TSchema>>[]>;
  findAllPaginated(
    dbName: string,
    filter: QueryFilter<InferSchemaType<TSchema>>,
    options: MongoPaginationOptions
  ): Promise<PaginatedResult<HydratedDocument<InferSchemaType<TSchema>>>>;
  update(
    dbName: string,
    id: string,
    data: UpdateQuery<InferSchemaType<TSchema>>
  ): Promise<HydratedDocument<InferSchemaType<TSchema>> | null>;
  delete(
    dbName: string,
    id: string
  ): Promise<HydratedDocument<InferSchemaType<TSchema>> | null>;
  count(
    dbName: string,
    filter?: QueryFilter<InferSchemaType<TSchema>>
  ): Promise<number>;
}
/**
 * DDD Repository Pattern - Infrastructure Layer
 *
 * Responsibilities:
 * - Data access only, no business decisions
 * - Returns raw database results (null if not found)
 * - Service layer decides how to handle null/errors
 */
export abstract class AbstractMongoRepository<
  TSchema extends Schema,
> implements IRepository<TSchema> {
  protected mongodb: MongoDB;

  private modelCache = new Map<string, Model<InferSchemaType<TSchema>>>();

  constructor(
    mongodb: MongoDB,
    protected schema: TSchema,
    protected collectionName: string,
    protected options?: CompileModelOptions
  ) {
    this.mongodb = mongodb;
  }

  @Trace()
  getCollection(dbName: string): Model<InferSchemaType<TSchema>> {
    const cacheKey = `${dbName}:${this.collectionName}`;

    if (!this.modelCache.has(cacheKey)) {
      const conn = this.mongodb.getRealmDb(dbName);
      const model = conn.model<InferSchemaType<TSchema>>(
        this.collectionName,
        this.schema,
        this.collectionName,
        this.options
      );
      this.modelCache.set(cacheKey, model);
    }

    return this.modelCache.get(cacheKey)!;
  }

  @TraceAsync()
  async create(
    dbName: string,
    data: DeepPartial<
      ApplyBasicCreateCasting<Require_id<InferSchemaType<TSchema>>>
    >
  ): Promise<HydratedDocument<InferSchemaType<TSchema>>> {
    const collection = this.getCollection(dbName);
    return collection.create(data);
  }

  @TraceAsync()
  async findById(
    dbName: string,
    id: string
  ): Promise<HydratedDocument<InferSchemaType<TSchema>> | null> {
    const collection = this.getCollection(dbName);
    return collection.findById(id);
  }

  @TraceAsync()
  async findOne(
    dbName: string,
    filter: QueryFilter<InferSchemaType<TSchema>>
  ): Promise<HydratedDocument<InferSchemaType<TSchema>> | null> {
    const collection = this.getCollection(dbName);
    return collection.findOne(filter);
  }

  @TraceAsync()
  async findAll(
    dbName: string,
    filter: QueryFilter<InferSchemaType<TSchema>> = {}
  ): Promise<HydratedDocument<InferSchemaType<TSchema>>[]> {
    const collection = this.getCollection(dbName);
    return collection.find(filter);
  }

  @TraceAsync()
  async findAllPaginated(
    dbName: string,
    filter: QueryFilter<InferSchemaType<TSchema>>,
    options: MongoPaginationOptions
  ): Promise<PaginatedResult<HydratedDocument<InferSchemaType<TSchema>>>> {
    const collection = this.getCollection(dbName);

    let query = collection.find(filter);

    if (options.sortBy) {
      const sortOrder = options.descending ? -1 : 1;
      query = query.sort({ [options.sortBy]: sortOrder });
    }

    query = query.skip(options.skip).limit(options.limit);

    const [data, total] = await Promise.all([
      query.exec(),
      collection.countDocuments(filter),
    ]);

    return { data, total };
  }

  @TraceAsync()
  async update(
    dbName: string,
    id: string,
    data: UpdateQuery<InferSchemaType<TSchema>>
  ): Promise<HydratedDocument<InferSchemaType<TSchema>> | null> {
    const collection = this.getCollection(dbName);
    return collection.findByIdAndUpdate(id, data);
  }

  @TraceAsync()
  async delete(
    dbName: string,
    id: string
  ): Promise<HydratedDocument<InferSchemaType<TSchema>> | null> {
    const collection = this.getCollection(dbName);
    return collection.findByIdAndDelete(id);
  }

  @TraceAsync()
  async count(
    dbName: string,
    filter: QueryFilter<InferSchemaType<TSchema>> = {}
  ): Promise<number> {
    const collection = this.getCollection(dbName);
    return collection.countDocuments(filter);
  }
}
