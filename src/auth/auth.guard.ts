import { CanActivate, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { StrategyRegistry } from './strategy.registry';

export const AuthGuard = (name: string) => {
  return class AuthGuard implements CanActivate {
    public async canActivate(context: ExecutionContext): Promise<boolean> {
      const strategy = new StrategyRegistry().getStrategy(name);

      if (!strategy) {
        console.warn(`strategy with name: ${name} not found`);
        throw new InternalServerErrorException();
      }

      const user = await Promise.resolve(strategy.validate(context));
      const req = context.switchToHttp().getRequest();

      req.user = user;

      return true;
    }
  };
};
