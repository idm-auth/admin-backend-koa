import { DocIdSchema, DtoTypes, MetadataSchema } from 'koa-inversify-framework/common';
import { z } from 'zod';

export const applicationConfigurationCreateSchema = z.object({
  name: z.string().min(1),
  environment: z.string().min(1),
  config: z.record(z.string(), z.any()).default({}),
  schema: z.record(z.string(), z.any()).optional(),
});

export const applicationConfigurationResponseSchema = z.object({
  _id: DocIdSchema,
  name: z.string(),
  environment: z.string(),
  config: z.record(z.string(), z.any()),
  schema: z.record(z.string(), z.any()).optional(),
  metadata: MetadataSchema,
});

export const applicationConfigurationUpdateSchema = z.object({
  config: z.record(z.string(), z.any()).optional(),
  schema: z.record(z.string(), z.any()).optional(),
});

export type ApplicationConfigurationCreate = z.infer<
  typeof applicationConfigurationCreateSchema
>;
export type ApplicationConfigurationResponse = z.infer<
  typeof applicationConfigurationResponseSchema
>;
export type ApplicationConfigurationUpdate = z.infer<
  typeof applicationConfigurationUpdateSchema
>;

export interface ApplicationConfigurationDtoTypes extends DtoTypes {
  CreateRequestDto: ApplicationConfigurationCreate;
  CreateResponseDto: ApplicationConfigurationResponse;
  FindByIdResponseDto: ApplicationConfigurationResponse;
  FindOneResponseDto: ApplicationConfigurationResponse;
  FindAllResponseDto: ApplicationConfigurationResponse[];
  UpdateRequestDto: ApplicationConfigurationUpdate;
  UpdateResponseDto: ApplicationConfigurationResponse;
  DeleteResponseDto: ApplicationConfigurationResponse;
  PaginatedItemDto: ApplicationConfigurationResponse;
}
