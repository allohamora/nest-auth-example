import { applyDecorators, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiException } from 'src/utils/api-exception.decorator';
import { AuthGuard } from './auth.guard';

interface Options {
  strategy?: 'jwt' | 'local';
}

export const Auth = ({ strategy = 'jwt' }: Options = {}) => {
  const decorators = [UseGuards(AuthGuard(strategy)), ApiException({ statusCode: HttpStatus.UNAUTHORIZED })];

  if (strategy === 'jwt') {
    decorators.push(ApiBearerAuth());
  }

  return applyDecorators(...decorators);
};
