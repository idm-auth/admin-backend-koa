import { DocIdSchema, DtoTypes } from 'koa-inversify-framework/common';
import { z } from 'zod';

export const applicationCreateSchema = z.object({
  name: z.string().min(1),
  systemId: z.string().min(1),
});

export const applicationBaseResponseSchema = z.object({
  _id: DocIdSchema,
  name: z.string(),
  systemId: z.string(),
  applicationSecret: z.string(),
  isActive: z.boolean(),
});

export const applicationUpdateSchema = z.object({
  name: z.string().optional(),
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
