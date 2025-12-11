import { DtoTypes } from '@/common/dto.types';
import { Trace } from '@/infrastructure/telemetry/trace.decorator';
import { HydratedDocument, InferSchemaType, Schema } from 'mongoose';
import { z } from 'zod';

export interface IMapper<TSchema extends Schema, T extends DtoTypes> {
  toCreateResponseDto(
    entity: HydratedDocument<InferSchemaType<TSchema>>
  ): T['CreateResponseDto'];
  toFindByIdResponseDto(
    entity: HydratedDocument<InferSchemaType<TSchema>>
  ): T['FindByIdResponseDto'];
  toFindOneResponseDto(
    entity: HydratedDocument<InferSchemaType<TSchema>>
  ): T['FindOneResponseDto'];
  toFindAllResponseDto(
    entities: HydratedDocument<InferSchemaType<TSchema>>[]
  ): T['FindAllResponseDto'];
  toUpdateResponseDto(
    entity: HydratedDocument<InferSchemaType<TSchema>>
  ): T['UpdateResponseDto'];
  toDeleteResponseDto(
    entity: HydratedDocument<InferSchemaType<TSchema>>
  ): T['DeleteResponseDto'];
  toPaginatedResponseDto(
    entities: Array<HydratedDocument<InferSchemaType<TSchema>>>
  ): Array<T['PaginatedResponseDto']>;
}

export interface MapperSchemas<T extends DtoTypes> {
  createResponseSchema: z.ZodType<T['CreateResponseDto']>;
  findByIdResponseSchema: z.ZodType<T['FindByIdResponseDto']>;
  findOneResponseSchema: z.ZodType<T['FindOneResponseDto']>;
  updateResponseSchema: z.ZodType<T['UpdateResponseDto']>;
  deleteResponseSchema: z.ZodType<T['DeleteResponseDto']>;
  paginatedResponseSchema: z.ZodType<T['PaginatedResponseDto']>;
}

export abstract class AbstractMapper<
  TSchema extends Schema,
  T extends DtoTypes,
> implements IMapper<TSchema, T> {
  constructor(protected schemas: MapperSchemas<T>) {}

  protected toDto(entity: HydratedDocument<InferSchemaType<TSchema>>): Record<string, unknown> {
    return entity.toObject();
  }

  @Trace()
  toCreateResponseDto(
    entity: HydratedDocument<InferSchemaType<TSchema>>
  ): T['CreateResponseDto'] {
    return this.schemas.createResponseSchema.parse(this.toDto(entity));
  }

  @Trace()
  toFindByIdResponseDto(
    entity: HydratedDocument<InferSchemaType<TSchema>>
  ): T['FindByIdResponseDto'] {
    return this.schemas.findByIdResponseSchema.parse(this.toDto(entity));
  }

  @Trace()
  toFindOneResponseDto(
    entity: HydratedDocument<InferSchemaType<TSchema>>
  ): T['FindOneResponseDto'] {
    return this.schemas.findOneResponseSchema.parse(this.toDto(entity));
  }

  @Trace()
  toUpdateResponseDto(
    entity: HydratedDocument<InferSchemaType<TSchema>>
  ): T['UpdateResponseDto'] {
    return this.schemas.updateResponseSchema.parse(this.toDto(entity));
  }

  @Trace()
  toDeleteResponseDto(
    entity: HydratedDocument<InferSchemaType<TSchema>>
  ): T['DeleteResponseDto'] {
    return this.schemas.deleteResponseSchema.parse(this.toDto(entity));
  }

  @Trace()
  toPaginatedResponseDto(
    entities: HydratedDocument<InferSchemaType<TSchema>>[]
  ): Array<T['PaginatedResponseDto']> {
    return entities.map(e => this.schemas.paginatedResponseSchema.parse(this.toDto(e)));
  }

  @Trace()
  toFindAllResponseDto(
    entities: HydratedDocument<InferSchemaType<TSchema>>[]
  ): T['FindAllResponseDto'] {
    return entities.map(e => this.toFindByIdResponseDto(e)) as T['FindAllResponseDto'];
  }
}
