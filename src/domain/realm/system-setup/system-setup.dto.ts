import {
  DocIdSchema,
  DtoTypes,
} from '@idm-auth/koa-inversify-framework/common';
import { z } from 'zod';

export const systemSetupUpdateSchema = z.object({
  jwtSecret: z.string().min(32).optional(),
  accessTokenExpiresIn: z.string().optional(),
  refreshTokenExpiresIn: z.string().optional(),
});

export const systemSetupResponseSchema = z.object({
  _id: DocIdSchema,
  setupKey: z.string(),
  lastRepairAt: z.date().optional(),
  version: z.string(),
  jwtSecret: z.string(),
  accessTokenExpiresIn: z.string(),
  refreshTokenExpiresIn: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SystemSetupUpdate = z.infer<typeof systemSetupUpdateSchema>;
export type SystemSetupResponse = z.infer<typeof systemSetupResponseSchema>;

export interface SystemSetupDtoTypes extends DtoTypes {
  CreateRequestDto: never;
  CreateResponseDto: SystemSetupResponse;
  FindByIdResponseDto: SystemSetupResponse;
  FindOneResponseDto: SystemSetupResponse;
  FindAllResponseDto: SystemSetupResponse[];
  UpdateRequestDto: SystemSetupUpdate;
  UpdateResponseDto: SystemSetupResponse;
  DeleteResponseDto: SystemSetupResponse;
  PaginatedItemDto: SystemSetupResponse;
}
