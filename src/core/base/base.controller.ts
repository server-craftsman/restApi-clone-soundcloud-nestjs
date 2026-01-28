import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseDto } from '../dto';

export class BaseController {
  /**
   * Send success response
   */
  sendSuccess<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: HttpStatus = HttpStatus.OK,
  ): Response {
    const response = new ApiResponseDto<T>({
      success: true,
      data,
      message,
      statusCode,
    });
    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  sendError(
    res: Response,
    err: string | Record<string, any>,
    message: string = 'Error',
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ): Response {
    const response = new ApiResponseDto({
      success: false,
      err,
      message,
      statusCode,
    });
    return res.status(statusCode).json(response);
  }

  /**
   * Send paginated response
   */
  sendPaginated<T>(
    res: Response,
    items: T[],
    total: number,
    page: number,
    limit: number,
    statusCode: HttpStatus = HttpStatus.OK,
  ): Response {
    const response = new ApiResponseDto<{
      items: T[];
      total: number;
      page: number;
      limit: number;
      pages: number;
    }>({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      statusCode,
    });
    return res.status(statusCode).json(response);
  }
}
