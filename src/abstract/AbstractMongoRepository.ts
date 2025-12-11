import { PaginatedResult } from '@/common/pagination.dto';
import {
  MongoDB,
  MongoDBSymbol,
} from '@/infrastructure/mongodb/mongodb.provider';
import { Trace, TraceAsync } from '@/infrastructure/telemetry/trace.decorator';
import { inject } from 'inversify';
import type {
  ApplyBasicCreateCasting,
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

export interface IRepository<TEntity> {
  create(
    dbName: string,
    data: DeepPartial<ApplyBasicCreateCasting<Require_id<TEntity>>>
  ): Promise<TEntity>;
  findById(dbName: string, id: string): Promise<TEntity | null>;
  findOne(dbName: string, filter: QueryFilter<TEntity>): Promise<TEntity | null>;
  findAll(dbName: string, filter?: QueryFilter<TEntity>): Promise<TEntity[]>;
  findAllPaginated(
    dbName: string,
    filter: QueryFilter<TEntity>,
    options: MongoPaginationOptions
  ): Promise<PaginatedResult<TEntity>>;
  update(
    dbName: string,
    id: string,
    data: UpdateQuery<TEntity>
  ): Promise<TEntity | null>;
  delete(dbName: string, id: string): Promise<TEntity | null>;
  count(dbName: string, filter?: QueryFilter<TEntity>): Promise<number>;
}

/**
 * DDD Repository Pattern - Infrastructure Layer
 *
 * Responsibilities:
 * - Data access only, no business decisions
 * - Returns raw database results (null if not found)
 * - Service layer decides how to handle null/errors
 */
export abstract class AbstractMongoRepository<TSchema extends Schema>
  implements IRepository<HydratedDocument<InferSchemaType<TSchema>>>
{
  @inject(MongoDBSymbol) protected mongodb!: MongoDB;
  private modelCache = new Map<string, Model<InferSchemaType<TSchema>>>();

  constructor(
    protected schema: TSchema,
    protected collectionName: string
  ) {}

  @Trace()
  protected getCollection(dbName: string): Model<InferSchemaType<TSchema>> {
    const cacheKey = `${dbName}:${this.collectionName}`;

    if (!this.modelCache.has(cacheKey)) {
      const conn = this.mongodb.getRealmDb(dbName);
      const model = conn.model<InferSchemaType<TSchema>>(
        this.collectionName,
        this.schema
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
    const doc = await collection.create(data);
    return doc;
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
    filter: QueryFilter<HydratedDocument<InferSchemaType<TSchema>>>
  ): Promise<HydratedDocument<InferSchemaType<TSchema>> | null> {
    const collection = this.getCollection(dbName);
    return collection.findOne(filter);
  }

  @TraceAsync()
  async findAll(
    dbName: string,
    filter: QueryFilter<HydratedDocument<InferSchemaType<TSchema>>> = {}
  ): Promise<HydratedDocument<InferSchemaType<TSchema>>[]> {
    const collection = this.getCollection(dbName);
    return collection.find(filter);
  }

  @TraceAsync()
  async findAllPaginated(
    dbName: string,
    filter: QueryFilter<HydratedDocument<InferSchemaType<TSchema>>>,
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
    data: UpdateQuery<HydratedDocument<InferSchemaType<TSchema>>>
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
    filter: QueryFilter<HydratedDocument<InferSchemaType<TSchema>>> = {}
  ): Promise<number> {
    const collection = this.getCollection(dbName);
    return collection.countDocuments(filter);
  }
}
