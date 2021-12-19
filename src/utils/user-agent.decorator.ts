import { createParamDecorator, ExecutionContext, Headers } from '@nestjs/common';
import { Request } from 'express';

export const UserAgent = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req: Request = ctx.switchToHttp().getRequest();

  return req.headers['user-agent'];
});
