import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(25),
  filter: z.string().optional(),
  sortBy: z.string().optional(),
  // amazonq-ignore-next-line
  descending: z.stringbool().default(false),
});

export const paginationMetaSchema = z
  .object({
    total: z.number(),
    page: z.number(),
    rowsPerPage: z.number(),
    totalPages: z.number(),
  })
  .openapi({ description: 'Pagination metadata' });

export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z
    .object({
      data: z.array(itemSchema),
      pagination: paginationMetaSchema,
    })
    .openapi({ description: 'Paginated response' });

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type PaginatedResponse<T> = {
  data: T[];
  pagination: PaginationMeta;
};
