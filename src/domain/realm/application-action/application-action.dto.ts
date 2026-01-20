import { DocIdSchema, DtoTypes } from 'koa-inversify-framework/common';
import { z } from 'zod';

export const applicationActionCreateSchema = z.object({
  applicationId: DocIdSchema,
  resourceType: z.string().min(1),
  pathPattern: z.string().min(1).regex(/^\//, 'Path pattern must start with /'),
  operations: z.array(z.string().min(1)).min(1),
});

export const applicationActionBaseResponseSchema = z.object({
  _id: DocIdSchema,
  applicationId: DocIdSchema,
  resourceType: z.string(),
  pathPattern: z.string(),
  operations: z.array(z.string()),
  createdAt: z.date().transform(d => d.toISOString()),
  updatedAt: z.date().transform(d => d.toISOString()),
});

export const applicationActionUpdateSchema = z.object({
  operations: z.array(z.string().min(1)).min(1),
});

export type ApplicationActionCreate = z.infer<typeof applicationActionCreateSchema>;
export type ApplicationActionUpdate = z.infer<typeof applicationActionUpdateSchema>;
export type ApplicationActionResponse = z.infer<typeof applicationActionBaseResponseSchema>;

export interface ApplicationActionDtoTypes extends DtoTypes {
  CreateRequestDto: ApplicationActionCreate;
  CreateResponseDto: ApplicationActionResponse;
  FindByIdResponseDto: ApplicationActionResponse;
  FindOneResponseDto: ApplicationActionResponse;
  FindAllResponseDto: ApplicationActionResponse[];
  UpdateRequestDto: ApplicationActionUpdate;
  UpdateResponseDto: ApplicationActionResponse;
  DeleteResponseDto: ApplicationActionResponse;
  PaginatedItemDto: ApplicationActionResponse;
}
