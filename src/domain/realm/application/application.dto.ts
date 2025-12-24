import { DocIdSchema, DtoTypes } from 'koa-inversify-framework/common';
import { z } from 'zod';

const availableActionSchema = z.object({
  resourceType: z.string().min(1),
  pathPattern: z.string().min(1).regex(/^\//, 'Path pattern must start with /'),
  operations: z.array(z.string().min(1)).min(1),
});

export const applicationCreateSchema = z.object({
  name: z.string().min(1),
  systemId: z.string().min(1),
  availableActions: z.array(availableActionSchema).min(1),
});

export const applicationBaseResponseSchema = z.object({
  _id: DocIdSchema,
  name: z.string(),
  systemId: z.string(),
  availableActions: z.array(
    z.object({
      resourceType: z.string(),
      pathPattern: z.string(),
      operations: z.array(z.string()),
    })
  ),
  applicationSecret: z.string(),
  isActive: z.boolean(),
});

export const applicationUpdateSchema = z.object({
  name: z.string().optional(),
  availableActions: z.array(availableActionSchema).optional(),
  isActive: z.boolean().optional(),
});

export type ApplicationCreate = z.infer<typeof applicationCreateSchema>;
export type ApplicationUpdate = z.infer<typeof applicationUpdateSchema>;
export type ApplicationResponse = z.infer<typeof applicationBaseResponseSchema>;

export interface ApplicationDtoTypes extends DtoTypes {
  CreateRequestDto: ApplicationCreate;
  CreateResponseDto: ApplicationResponse;
  FindByIdResponseDto: ApplicationResponse;
  FindOneResponseDto: ApplicationResponse;
  FindAllResponseDto: ApplicationResponse[];
  UpdateRequestDto: ApplicationUpdate;
  UpdateResponseDto: ApplicationResponse;
  DeleteResponseDto: ApplicationResponse;
  PaginatedItemDto: ApplicationResponse;
}
