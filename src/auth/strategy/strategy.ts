import { ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { StrategyRegistry } from '../strategy.registry';

export abstract class Strategy {
  constructor(name: string) {
    new StrategyRegistry().setStrategy(name, this);
  }

  public abstract validate(context: ExecutionContext): User | Promise<User>;
}
