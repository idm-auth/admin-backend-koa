import { z } from 'zod';

export interface DtoTypes {
  CreateRequestDto: z.infer<z.ZodTypeAny>;
  CreateResponseDto: z.infer<z.ZodTypeAny>;
  FindByIdResponseDto: z.infer<z.ZodTypeAny>;
  FindOneResponseDto: z.infer<z.ZodTypeAny>;
  FindAllResponseDto: z.infer<z.ZodTypeAny>;
  UpdateRequestDto: z.infer<z.ZodTypeAny>;
  UpdateResponseDto: z.infer<z.ZodTypeAny>;
  DeleteResponseDto: z.infer<z.ZodTypeAny>;
  PaginatedResponseDto: z.infer<z.ZodTypeAny>;
}
