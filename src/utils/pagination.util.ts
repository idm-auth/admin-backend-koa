import { Model } from 'mongoose';
import {
  PaginatedResponse,
  PaginationQuery,
} from '@/domains/commons/base/pagination.schema';
import { Span } from '@opentelemetry/api';

export type FilterQueryBuilder = (filter: string) => Record<string, unknown>;

export interface PaginationOptions<T> {
  model: Model<T>;
  query: PaginationQuery;
  defaultSortField?: string;
  span?: Span;
}

/**
 * Sanitiza string para uso seguro em regex MongoDB
 * Remove caracteres especiais que podem causar ReDoS ou bypass
 */
export const sanitizeRegexInputForFilter = (input: string): string => {
  // Remove ou escapa caracteres perigosos para regex
  return input
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escapa caracteres especiais de regex
    .replace(/\s+/g, ' ') // Normaliza espaços
    .trim()
    .substring(0, 1000); // Limita tamanho para prevenir ReDoS
};

/**
 * Executa paginação segura com filtro customizável
 */
export const executePagination = async <T>(
  options: PaginationOptions<T>,
  buildFilterQuery: FilterQueryBuilder
): Promise<PaginatedResponse<T>> => {
  const { model, query, defaultSortField = 'name', span } = options;

  const { page, limit, filter, sortBy, descending } = query;
  const skip = (page - 1) * limit;

  // Build filter query usando função customizada do service
  let filterQuery: Record<string, unknown> = {};
  if (filter) {
    const sanitizedFilter = sanitizeRegexInputForFilter(filter);
    filterQuery = buildFilterQuery(sanitizedFilter);
    span?.setAttributes({ 'query.filter': sanitizedFilter });
  }

  // Build sort query
  const sortQuery: Record<string, 1 | -1> = {};
  if (sortBy) {
    sortQuery[sortBy] = descending ? -1 : 1;
    span?.setAttributes({
      'query.sortBy': sortBy,
      'query.descending': descending,
    });
  } else {
    sortQuery[defaultSortField] = 1;
  }

  // Execute queries
  const [data, total] = await Promise.all([
    model.find(filterQuery).sort(sortQuery).skip(skip).limit(limit),
    model.countDocuments(filterQuery),
  ]);

  const totalPages = Math.ceil(total / limit);

  span?.setAttributes({
    'query.skip': skip,
    'query.limit': limit,
    'result.total': total,
    'result.totalPages': totalPages,
    'result.count': data.length,
  });

  return {
    data,
    pagination: {
      total,
      page: Number(page),
      rowsPerPage: Number(limit),
      totalPages,
    },
  };
};
