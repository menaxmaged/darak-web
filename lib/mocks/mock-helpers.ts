import type { ListMeta, PaginationMeta } from '@/types';

export const buildListMeta = (totalItems: number, currentPage = 1, pageSize = 20): ListMeta => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return {
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
};

export const buildPagination = (total: number, page = 1, limit = 20): PaginationMeta => {
  return {
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};

export const buildListResult = <T>(items: T[], page = 1, pageSize = 20) => {
  return {
    data: items,
    meta: buildListMeta(items.length, page, pageSize),
  };
};

export const buildPaginatedResult = <T>(items: T[], page = 1, pageSize = 20) => {
  return {
    data: items,
    meta: buildListMeta(items.length, page, pageSize),
    pagination: buildPagination(items.length, page, pageSize),
  };
};

export const mockSuccess = (message: string, data?: unknown) => ({
  success: true,
  message_en: message,
  data,
});
