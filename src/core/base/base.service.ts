import { Injectable } from '@nestjs/common';

/**
 * Base service class with common service patterns
 */
@Injectable()
export class BaseService {
  /**
   * Build pagination metadata
   */
  buildPaginationMeta(
    items: any[],
    total: number,
    page: number,
    limit: number,
  ) {
    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }
}
