import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';

interface Options {
  statusCode?: HttpStatus;
}

export const ApiException = ({ statusCode }: Options = { statusCode: HttpStatus.BAD_REQUEST }) => {
  class Exception {
    @ApiProperty({ type: Number, default: statusCode })
    statusCode: HttpStatus;

    @ApiProperty()
    message: string;
  }

  return ApiResponse({ status: statusCode, type: Exception });
};
