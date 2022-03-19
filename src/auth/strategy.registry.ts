import { Singleton } from 'src/utils/singleton.decorator';
import { Strategy } from './strategy/strategy';

@Singleton()
export class StrategyRegistry {
  private strategies: Map<string, Strategy> = new Map();

  public setStrategy(key: string, strategy: Strategy) {
    this.strategies.set(key, strategy);
  }

  public getStrategy(key: string) {
    return this.strategies.get(key);
  }
}
