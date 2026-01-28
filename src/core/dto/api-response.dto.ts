import { ApiProperty } from '@nestjs/swagger';
import { IApiResponse } from '../interfaces';

export class ApiResponseDto<T = any> implements IApiResponse<T> {
  @ApiProperty({ description: 'Response success status' })
  success: boolean;

  @ApiProperty({ description: 'Response data', required: false })
  data?: T;

  @ApiProperty({
    description: 'Error details if request failed',
    required: false,
  })
  err?: string | Record<string, any>;

  @ApiProperty({ description: 'Additional message', required: false })
  message?: string;

  @ApiProperty({ description: 'HTTP status code', required: false })
  statusCode?: number;

  constructor(partial: Partial<ApiResponseDto<T>> = {}) {
    Object.assign(this, partial);
  }
}
