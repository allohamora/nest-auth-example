import { Constructor } from 'src/types/constructor';

export const Singleton =
  () =>
  <T extends Constructor>(target: T) => {
    return class Singleton extends (target as Constructor) {
      static instance: Singleton;

      constructor(...args: ConstructorParameters<T>) {
        if (Singleton.instance) {
          return Singleton.instance;
        }

        super(...args);
        Singleton.instance = this;
        return this;
      }
    } as unknown as T;
  };
