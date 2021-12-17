import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentAbility = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().ability;
});
